
import React, { useMemo } from 'react';
import { DB } from '../db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, Package, CreditCard, Calendar } from 'lucide-react';

const Reports: React.FC = () => {
  const bills = DB.getBills();
  const medicines = DB.getMedicines();

  const reportStats = useMemo(() => {
    const totalRevenue = bills.reduce((sum, b) => sum + b.total, 0);
    const totalProfit = bills.reduce((sum, b) => {
      const billCost = b.items.reduce((iSum, item) => {
        const med = medicines.find(m => m.id === item.medicineId);
        return iSum + (item.quantity * (med?.costPrice || 0));
      }, 0);
      return sum + (b.total - billCost);
    }, 0);

    return {
      revenue: totalRevenue,
      profit: totalProfit,
      avgBill: bills.length ? Math.round(totalRevenue / bills.length) : 0,
      totalOrders: bills.length
    };
  }, [bills, medicines]);

  const topSellingMeds = useMemo(() => {
    const sales: Record<string, number> = {};
    bills.forEach(b => {
      b.items.forEach(i => {
        sales[i.medicineName] = (sales[i.medicineName] || 0) + i.quantity;
      });
    });
    return Object.entries(sales)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [bills]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Financial Reports</h2>
        <div className="bg-white border p-2 rounded-lg text-sm font-bold text-slate-500 flex items-center space-x-2">
          <Calendar size={16} />
          <span>Overall Lifetime</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ReportCard title="Total Revenue" value={`Rs. ${reportStats.revenue}`} sub="Gross sales amount" icon={<TrendingUp className="text-teal-600" />} />
        <ReportCard title="Estimated Profit" value={`Rs. ${reportStats.profit}`} sub="Revenue - Cost Price" icon={<CreditCard className="text-blue-600" />} />
        <ReportCard title="Avg. Order" value={`Rs. ${reportStats.avgBill}`} sub="Amount per customer" icon={<TrendingUp className="text-amber-600" />} />
        <ReportCard title="Total Orders" value={reportStats.totalOrders.toString()} sub="Completed transactions" icon={<Package className="text-indigo-600" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 uppercase text-xs tracking-widest text-slate-400">Top Selling Products</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSellingMeds} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" fontSize={12} width={120} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" fill="#0d9488" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 uppercase text-xs tracking-widest text-slate-400">Inventory Distribution</h3>
          <div className="h-80 flex items-center justify-center">
            {medicines.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Low Stock', value: medicines.filter(m => m.stock <= 10).length },
                      { name: 'In Stock', value: medicines.filter(m => m.stock > 10).length }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#f43f5e" />
                    <Cell fill="#0d9488" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 italic">No inventory data</p>
            )}
          </div>
          <div className="flex justify-center space-x-6 text-sm font-bold">
            <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span className="text-slate-500">Low Stock</span></div>
            <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-teal-500 rounded-full"></div><span className="text-slate-500">In Stock</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportCard = ({ title, value, sub, icon }: { title: string, value: string, sub: string, icon: any }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-2">
    <div className="flex justify-between items-start">
      <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
    </div>
    <div className="pt-2">
      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</h4>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-[10px] text-slate-500">{sub}</p>
    </div>
  </div>
);

export default Reports;
