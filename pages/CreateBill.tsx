import React, { useState, useMemo, useEffect } from 'react';
import { DB } from '../db';
import { Medicine, BillItem, Customer, Bill } from '../types';
// Fixed: Added ShoppingCart to imports
import { Search, Plus, Trash2, Printer, CheckCircle, Calculator, UserPlus, X, ShoppingCart } from 'lucide-react';

const CreateBill: React.FC = () => {
  const medicines = DB.getMedicines();
  const customers = DB.getCustomers();
  
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [cashPaid, setCashPaid] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastBill, setLastBill] = useState<Bill | null>(null);

  // Filter medicines based on stock and search
  const filteredMedicines = useMemo(() => {
    if (!searchQuery) return [];
    return medicines.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) && m.stock > 0
    );
  }, [searchQuery, medicines]);

  const total = useMemo(() => {
    return billItems.reduce((sum, item) => sum + item.subtotal, 0);
  }, [billItems]);

  const balance = useMemo(() => {
    return Math.max(0, cashPaid - total);
  }, [cashPaid, total]);

  const addItem = (med: Medicine) => {
    const existing = billItems.find(i => i.medicineId === med.id);
    if (existing) {
      if (existing.quantity >= med.stock) {
        alert('Insufficient stock!');
        return;
      }
      setBillItems(billItems.map(i => i.medicineId === med.id ? 
        { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.unitPrice } : i
      ));
    } else {
      setBillItems([...billItems, {
        medicineId: med.id,
        medicineName: med.name,
        quantity: 1,
        unitPrice: med.price,
        subtotal: med.price
      }]);
    }
    setSearchQuery('');
  };

  const removeItem = (id: string) => {
    setBillItems(billItems.filter(i => i.medicineId !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    const med = medicines.find(m => m.id === id);
    if (med && qty > med.stock) {
      alert(`Only ${med.stock} available in stock`);
      return;
    }
    if (qty < 1) return;
    setBillItems(billItems.map(i => i.medicineId === id ? 
      { ...i, quantity: qty, subtotal: qty * i.unitPrice } : i
    ));
  };

  const handleSaveBill = () => {
    if (billItems.length === 0) {
      alert('Add at least one item');
      return;
    }

    const customer = customers.find(c => c.id === selectedCustomerId);
    const date = new Date();
    const billNo = `BILL-${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(DB.getBills().length + 1).padStart(3, '0')}`;

    const newBill: Bill = {
      bill_no: billNo,
      date: date.toISOString(),
      customerId: selectedCustomerId,
      customerName: customer?.name || 'Walk-in Customer',
      items: billItems,
      total,
      cashPaid,
      balance
    };

    // Update stocks
    const updatedMedicines = medicines.map(m => {
      const sold = billItems.find(i => i.medicineId === m.id);
      if (sold) {
        return { ...m, stock: m.stock - sold.quantity };
      }
      return m;
    });

    DB.saveMedicines(updatedMedicines);
    const allBills = DB.getBills();
    DB.saveBills([...allBills, newBill]);
    
    setLastBill(newBill);
    setIsSuccess(true);
    setBillItems([]);
    setCashPaid(0);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isSuccess && lastBill) {
    return (
      <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-teal-100 text-center space-y-4 no-print">
          <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Bill Generated Successfully!</h2>
          <p className="text-slate-500">Bill Number: <span className="font-bold text-slate-900">{lastBill.bill_no}</span></p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button 
              onClick={handlePrint}
              className="flex items-center justify-center space-x-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
            >
              <Printer size={20} />
              <span>Print Receipt</span>
            </button>
            <button 
              onClick={() => setIsSuccess(false)}
              className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              New Bill
            </button>
          </div>
        </div>

        {/* Print Layout */}
        <div className="bg-white p-8 rounded-none border-2 border-slate-200 shadow-sm print-only block font-mono text-sm leading-tight">
          <div className="text-center space-y-1 mb-6 border-b-2 border-dotted border-slate-400 pb-4">
            <h1 className="text-xl font-bold uppercase">Khan Medical Complex</h1>
            <p>Main Road, Near Hospital City</p>
            <p>Contact: 0300-1234567</p>
          </div>
          
          <div className="flex justify-between mb-4">
            <div>
              <p><span className="font-bold">Bill No:</span> {lastBill.bill_no}</p>
              <p><span className="font-bold">Customer:</span> {lastBill.customerName}</p>
            </div>
            <div className="text-right">
              <p><span className="font-bold">Date:</span> {new Date(lastBill.date).toLocaleString()}</p>
            </div>
          </div>

          <table className="w-full mb-6 text-left border-collapse">
            <thead>
              <tr className="border-y-2 border-dotted border-slate-400">
                <th className="py-2">Item</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {lastBill.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2">{item.medicineName}</td>
                  <td className="py-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-right">{item.unitPrice}</td>
                  <td className="py-2 text-right">{item.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-1 border-t-2 border-dotted border-slate-400 pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>GRAND TOTAL</span>
              <span>Rs. {lastBill.total}</span>
            </div>
            <div className="flex justify-between">
              <span>Cash Received</span>
              <span>Rs. {lastBill.cashPaid}</span>
            </div>
            <div className="flex justify-between text-teal-700">
              <span>Change/Balance</span>
              <span>Rs. {lastBill.balance}</span>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t-2 border-dotted border-slate-400 text-center italic text-xs">
            <p>Thank you for your visit!</p>
            <p>Medicines once sold will not be returned.</p>
            <p>Generated by KMC Management System</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Billing Counter</h2>
        <div className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border">
          Today: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Item Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search and add medicine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-medium"
                />
                
                {filteredMedicines.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden max-h-64 overflow-y-auto">
                    {filteredMedicines.map(med => (
                      <button
                        key={med.id}
                        onClick={() => addItem(med)}
                        className="w-full flex justify-between items-center p-4 hover:bg-teal-50 transition-colors border-b border-slate-100 last:border-0"
                      >
                        <div className="text-left">
                          <p className="font-bold text-slate-800">{med.name}</p>
                          <p className="text-xs text-slate-500">{med.category} • Stock: {med.stock}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-teal-600">Rs. {med.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Medicine</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Subtotal</th>
                    <th className="px-4 py-3 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {billItems.map((item) => (
                    <tr key={item.medicineId} className="group">
                      <td className="px-4 py-4 font-semibold text-slate-800">{item.medicineName}</td>
                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex items-center space-x-2 bg-slate-100 rounded-lg p-1">
                          <button onClick={() => updateQuantity(item.medicineId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors">-</button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.medicineId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors">+</button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-medium text-slate-600">Rs. {item.unitPrice}</td>
                      <td className="px-4 py-4 text-right font-bold text-slate-900">Rs. {item.subtotal}</td>
                      <td className="px-4 py-4 text-right">
                        <button onClick={() => removeItem(item.medicineId)} className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {billItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                        <ShoppingCart size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="italic">Cart is empty. Search above to add medicines.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Customer & Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 flex items-center space-x-2 border-b border-slate-100 pb-4">
              <Calculator size={18} />
              <span>Checkout Details</span>
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Customer</label>
              <select 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                value={selectedCustomerId}
                onChange={e => setSelectedCustomerId(e.target.value)}
              >
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Items Total</span>
                <span>Rs. {total}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-slate-900">
                <span>Grand Total</span>
                <span className="text-teal-600">Rs. {total}</span>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Cash Received (Rs.)</label>
                <input
                  type="number"
                  value={cashPaid || ''}
                  onChange={e => setCashPaid(parseFloat(e.target.value) || 0)}
                  className="w-full p-4 bg-teal-50 border-2 border-teal-100 rounded-xl text-2xl font-bold text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="0.00"
                />
              </div>
              <div className="p-4 bg-slate-50 rounded-xl flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-500">Change Due</span>
                <span className="text-xl font-bold text-slate-900">Rs. {balance}</span>
              </div>
            </div>

            <button
              onClick={handleSaveBill}
              disabled={billItems.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-xl transition-all transform active:scale-[0.98] ${
                billItems.length > 0 
                  ? 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/20' 
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              Complete Sale & Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBill;