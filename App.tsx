import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Pill, 
  ShoppingCart, 
  Receipt, 
  Users, 
  Truck, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Medicines from './pages/Medicines';
import CreateBill from './pages/CreateBill';
import ViewBills from './pages/ViewBills';
import Suppliers from './pages/Suppliers';
import Customers from './pages/Customers';
import Stock from './pages/Stock';
import Reports from './pages/Reports';
import Login from './pages/Login';

const Navigation = ({ isMobileMenuOpen, setIsMobileMenuOpen }: { isMobileMenuOpen: boolean, setIsMobileMenuOpen: (v: boolean) => void }) => {
  const location = useLocation();
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/medicines', label: 'Medicines', icon: Pill },
    { path: '/billing', label: 'Create Bill', icon: ShoppingCart },
    { path: '/bills', label: 'View Bills', icon: Receipt },
    { path: '/stock', label: 'Stock Mgmt', icon: BarChart3 },
    { path: '/suppliers', label: 'Suppliers', icon: Truck },
    { path: '/customers', label: 'Customers', icon: Users },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
  ];

  const handleLogout = () => {
    localStorage.removeItem('kmc_auth');
    window.location.href = '/';
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-screen sticky top-0 overflow-y-auto no-print">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-teal-400">Khan Medical</h1>
          <p className="text-xs text-slate-400">Complex System</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                location.pathname === item.path ? 'bg-teal-600 text-white' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 w-full text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Overlay */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-50 no-print">
        <h1 className="text-lg font-bold text-teal-400">Khan Medical</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900 z-40 pt-16 p-4 no-print overflow-y-auto">
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 p-4 rounded-lg transition-colors ${
                  location.pathname === item.path ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}
              >
                <item.icon size={24} />
                <span className="text-lg font-medium">{item.label}</span>
              </Link>
            ))}
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 p-4 w-full bg-red-900/30 text-red-400 rounded-lg"
            >
              <LogOut size={24} />
              <span className="text-lg font-medium">Logout</span>
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

// Fixed: changed children to optional to resolve TypeScript error in Route element
const PrivateRoute = ({ children }: { children?: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('kmc_auth') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Navigation 
                  isMobileMenuOpen={isMobileMenuOpen} 
                  setIsMobileMenuOpen={setIsMobileMenuOpen} 
                />
                <main className="flex-1 overflow-x-hidden">
                  <div className="container mx-auto p-4 md:p-8">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/medicines" element={<Medicines />} />
                      <Route path="/billing" element={<CreateBill />} />
                      <Route path="/bills" element={<ViewBills />} />
                      <Route path="/stock" element={<Stock />} />
                      <Route path="/suppliers" element={<Suppliers />} />
                      <Route path="/customers" element={<Customers />} />
                      <Route path="/reports" element={<Reports />} />
                    </Routes>
                  </div>
                </main>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;