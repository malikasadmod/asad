
import React, { useState } from 'react';
import { DB } from '../db';
import { Customer } from '../types';
import { Plus, User, Phone, ShoppingBag } from 'lucide-react';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(DB.getCustomers());
  const bills = DB.getBills();

  const getCustomerStats = (id: string) => {
    const custBills = bills.filter(b => b.customerId === id);
    const totalSpent = custBills.reduce((sum, b) => sum + b.total, 0);
    return { count: custBills.length, total: totalSpent };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Customer Records</h2>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg font-bold flex items-center space-x-2 shadow-lg shadow-teal-600/20">
          <Plus size={20} />
          <span>Add Customer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((cust) => {
          const stats = getCustomerStats(cust.id);
          return (
            <div key={cust.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold text-xl uppercase">
                  {cust.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{cust.name}</h3>
                  <div className="flex items-center text-xs text-slate-500 font-medium">
                    <Phone size={12} className="mr-1" /> {cust.contact}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Orders</p>
                  <p className="text-lg font-bold text-slate-800">{stats.count}</p>
                </div>
                <div className="p-3 bg-teal-50 rounded-lg text-center">
                  <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Total Spent</p>
                  <p className="text-lg font-bold text-teal-700">Rs. {stats.total}</p>
                </div>
              </div>

              <button className="w-full mt-4 py-2 text-sm font-bold text-slate-600 hover:text-teal-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100">
                View Transaction History
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Customers;
