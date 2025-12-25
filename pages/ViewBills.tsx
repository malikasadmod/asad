
import React, { useState } from 'react';
import { DB } from '../db';
import { Bill } from '../types';
import { Search, Receipt, Printer, Eye, Trash2 } from 'lucide-react';

const ViewBills: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>(DB.getBills());
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBills = bills.filter(b => 
    b.bill_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  ).reverse();

  const handleDelete = (billNo: string) => {
    if (window.confirm('Are you sure you want to cancel this bill? Stock will NOT be automatically reverted.')) {
      const newBills = bills.filter(b => b.bill_no !== billNo);
      setBills(newBills);
      DB.saveBills(newBills);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Sales Transactions</h2>
        <div className="text-sm text-slate-500 font-medium">Total: {bills.length} bills</div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by Bill No or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Bill No</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Items</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Total</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.map((bill) => (
                <tr key={bill.bill_no} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-700">{bill.bill_no}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{new Date(bill.date).toLocaleString()}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{bill.customerName}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold">
                      {bill.items.length} items
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-teal-600">Rs. {bill.total}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg" title="View/Print">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleDelete(bill.bill_no)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBills.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <Receipt size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="italic">No transactions found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewBills;
