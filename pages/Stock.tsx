
import React from 'react';
import { DB } from '../db';
import { AlertTriangle, CheckCircle, Package, ArrowUpRight } from 'lucide-react';

const Stock: React.FC = () => {
  const medicines = DB.getMedicines();
  const lowStock = medicines.filter(m => m.stock <= 10);
  const outOfStock = medicines.filter(m => m.stock === 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Stock Management</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-red-50 border border-red-100 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg"><AlertTriangle /></div>
            <span className="text-2xl font-bold text-red-600">{outOfStock.length}</span>
          </div>
          <h3 className="font-bold text-red-900">Out of Stock</h3>
          <p className="text-sm text-red-700">Needs immediate reordering</p>
        </div>
        <div className="p-6 bg-amber-50 border border-amber-100 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Package /></div>
            <span className="text-2xl font-bold text-amber-600">{lowStock.length}</span>
          </div>
          <h3 className="font-bold text-amber-900">Low Stock</h3>
          <p className="text-sm text-amber-700">Below threshold (10 units)</p>
        </div>
        <div className="p-6 bg-teal-50 border border-teal-100 rounded-xl">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-teal-100 text-teal-600 rounded-lg"><CheckCircle /></div>
            <span className="text-2xl font-bold text-teal-600">{medicines.length - lowStock.length}</span>
          </div>
          <h3 className="font-bold text-teal-900">Optimal Level</h3>
          <p className="text-sm text-teal-700">Stable inventory</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-bold text-slate-800">Inventory Levels</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Medicine Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Current Stock</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {medicines.sort((a, b) => a.stock - b.stock).map((med) => (
                <tr key={med.id}>
                  <td className="px-6 py-4 font-semibold text-slate-800">{med.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">{med.stock}</span>
                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${med.stock <= 10 ? 'bg-red-500' : 'bg-teal-500'}`} 
                          style={{width: `${Math.min(100, (med.stock / 100) * 100)}%`}}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {med.stock === 0 ? (
                      <span className="text-xs font-bold text-red-600 px-2 py-1 bg-red-100 rounded-full">EMPTY</span>
                    ) : med.stock <= 10 ? (
                      <span className="text-xs font-bold text-amber-600 px-2 py-1 bg-amber-100 rounded-full">CRITICAL</span>
                    ) : (
                      <span className="text-xs font-bold text-teal-600 px-2 py-1 bg-teal-100 rounded-full">OK</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm font-bold text-teal-600 hover:underline flex items-center justify-end space-x-1">
                      <span>Order More</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stock;
