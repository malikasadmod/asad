
import React, { useState } from 'react';
import { DB } from '../db';
import { Medicine } from '../types';
import { Plus, Search, Edit2, Trash2, X, Save } from 'lucide-react';

const Medicines: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>(DB.getMedicines());
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMed, setEditingMed] = useState<Medicine | null>(null);

  const [formData, setFormData] = useState<Partial<Medicine>>({
    name: '',
    category: '',
    price: 0,
    costPrice: 0,
    stock: 0,
    expiry: '',
    supplierId: ''
  });

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (med?: Medicine) => {
    if (med) {
      setEditingMed(med);
      setFormData(med);
    } else {
      setEditingMed(null);
      setFormData({
        name: '',
        category: '',
        price: 0,
        costPrice: 0,
        stock: 0,
        expiry: '',
        supplierId: 'SUP001'
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    let newMedicines;
    if (editingMed) {
      newMedicines = medicines.map(m => m.id === editingMed.id ? { ...m, ...formData } as Medicine : m);
    } else {
      const newId = `MED${String(medicines.length + 1).padStart(3, '0')}`;
      newMedicines = [...medicines, { ...formData, id: newId } as Medicine];
    }
    setMedicines(newMedicines);
    DB.saveMedicines(newMedicines);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      const newMedicines = medicines.filter(m => m.id !== id);
      setMedicines(newMedicines);
      DB.saveMedicines(newMedicines);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Medicine Inventory</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-teal-600/20"
        >
          <Plus size={20} />
          <span>Add New Medicine</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Stock</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Expiry</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedicines.map((med) => (
                <tr key={med.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-600">{med.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{med.name}</td>
                  <td className="px-6 py-4 text-slate-600">{med.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${med.stock <= 10 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {med.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-teal-600">Rs. {med.price}</td>
                  <td className="px-6 py-4 text-slate-600">{med.expiry}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleOpenModal(med)} className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(med.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMedicines.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400 italic">No medicines found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-teal-600 text-white">
              <h3 className="text-xl font-bold">{editingMed ? 'Edit Medicine' : 'Add New Medicine'}</h3>
              <button onClick={() => setShowModal(false)} className="hover:bg-white/20 p-1 rounded-full"><X size={24} /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Medicine Name</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg" 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Expiry Date</label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded-lg" 
                  value={formData.expiry}
                  onChange={e => setFormData({...formData, expiry: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Stock Level</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg" 
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Sale Price (Rs.)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg font-bold text-teal-600" 
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Cost Price (Rs.)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg" 
                  value={formData.costPrice}
                  onChange={e => setFormData({...formData, costPrice: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Supplier</label>
                <select 
                  className="w-full p-2 border rounded-lg" 
                  value={formData.supplierId}
                  onChange={e => setFormData({...formData, supplierId: e.target.value})}
                >
                  {DB.getSuppliers().map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg font-bold shadow-lg shadow-teal-600/20 flex items-center space-x-2"
              >
                <Save size={18} />
                <span>Save Medicine</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Medicines;
