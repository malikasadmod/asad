
import React, { useState } from 'react';
import { DB } from '../db';
import { Supplier } from '../types';
import { Plus, Edit2, Trash2, Mail, Phone, MapPin } from 'lucide-react';

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(DB.getSuppliers());

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this supplier?')) {
      const newS = suppliers.filter(s => s.id !== id);
      setSuppliers(newS);
      DB.saveSuppliers(newS);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Supplier Directory</h2>
        <button className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-teal-600/20">
          <Plus size={20} />
          <span>Add Supplier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((sup) => (
          <div key={sup.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-900 text-lg">{sup.name}</h3>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(sup.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-slate-600">
                <Phone size={16} className="text-slate-400" />
                <span>{sup.contact}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-600">
                <Mail size={16} className="text-slate-400" />
                <span className="truncate">{sup.email}</span>
              </div>
              <div className="flex items-start space-x-3 text-sm text-slate-600">
                <MapPin size={16} className="text-slate-400 mt-1 flex-shrink-0" />
                <span>{sup.address}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{sup.id}</span>
              <button className="text-xs font-bold text-teal-600 hover:underline">View Purchase History</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suppliers;
