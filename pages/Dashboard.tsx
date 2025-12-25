
import React, { useMemo } from 'react';
import { Pill, Users, Receipt, AlertCircle, TrendingUp, Wallet } from 'lucide-react';
import { DB } from '../db';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const medicines = DB.getMedicines();
  const bills = DB.getBills();
  const suppliers = DB.getSuppliers();

  const stats = useMemo(() => {
    const totalSales = bills.reduce((acc, curr) => acc + curr.total, 0);
    const lowStockCount = medicines.filter(m => m.stock <= 10).length;
    const itemsSold = bills.reduce((acc, curr) => acc + curr.items.reduce((sum, i) => sum + i.quantity, 0), 0);
    const todaySales = bills
      .filter(b => b.date.split('T')[0] === new Date().toISOString().split('T')[0])
      .reduce((acc, curr) => acc + curr.total, 0);

    return {
      totalSales,
      lowStockCount,
      itemsSold,
      todaySales,
      totalMed: medicines.length,
      totalSup: suppliers.length
    };
  }, [medicines, bills, suppliers]);

  const recentSalesData = useMemo(() => {
    // Group last 7 days sales
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayTotal = bills
        .filter(b => b.date.startsWith(dateStr))
        .reduce((sum, b) => sum + b.total, 0);
      data.push({ name: dateStr.slice(5), value: dayTotal });
    }
    return data;
  }, [bills]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Operational Overview</h2>
        <div className="bg-teal-50 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
          <span>System Active</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Wallet className="text-teal-600" />} 
          title="Today's Sales" 
          value={`Rs. ${stats.todaySales}`} 
          color="bg-teal-50"
        />
        <StatCard 
          icon={<TrendingUp className="text-blue-600" />} 
          title="Total Revenue" 
          value={`Rs. ${stats.totalSales}`} 
          color="bg-blue-50"
        />
        <StatCard 
          icon={<AlertCircle className="text-amber-600" />} 
          title="Low Stock Items" 
          value={stats.lowStockCount.toString()} 
          color="bg-amber-50"
          alert={stats.lowStockCount > 0}
        />
        <StatCard 
          icon={<Pill className="text-indigo-600" />} 
          title="Medicines" 
          value={stats.totalMed.toString()} 
          color="bg-indigo-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center space-x-2">
            <TrendingUp size={18} />
            <span>Sales History (Last 7 Days)</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recentSalesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickMargin={10} />
                <YAxis fontSize={12} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {recentSalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 6 ? '#0d9488' : '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bills */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center space-x-2">
            <Receipt size={18} />
            <span>Recent Transactions</span>
          </h3>
          <div className="space-y-4">
            {bills.slice(-5).reverse().map((bill) => (
              <div key={bill.bill_no} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors border-l-2 border-teal-500">
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{bill.customerName}</p>
                  <p className="text-xs text-slate-500">{bill.bill_no} • {new Date(bill.date).toLocaleDateString()}</p>
                </div>
                <p className="font-bold text-teal-600">Rs. {bill.total}</p>
              </div>
            ))}
            {bills.length === 0 && (
              <p className="text-center text-slate-400 py-10 text-sm italic">No recent transactions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color, alert }: { icon: any, title: string, value: string, color: string, alert?: boolean }) => (
  <div className={`p-6 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-4 bg-white relative overflow-hidden`}>
    {alert && <div className="absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 bg-amber-500/10 rounded-full"></div>}
    <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className={`text-2xl font-bold text-slate-900 ${alert ? 'text-amber-600' : ''}`}>{value}</p>
    </div>
  </div>
);

export default Dashboard;
