import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const navItems = [
    { label: '📊 Dashboard', path: '/admin/dashboard' },
    { label: '💰 Pricing', path: '/admin/pricing' },
    { label: '📝 Content', path: '/admin/content' },
    { label: '👥 Leads', path: '/admin/leads' },
    { label: '📅 Bookings', path: '/admin/bookings' },
    { label: '🖼️ Portfolio', path: '/admin/portfolio' },
  ];

  return (
    <div className="flex h-screen bg-[#0E0E0E] text-[#F2EDE4] font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#171714] border-r border-[#B8966A]/20 flex flex-col">
        <div className="p-6 border-b border-[#B8966A]/20">
          <h1 className="text-xl font-bold text-[#B8966A]">ImmersiveEstates</h1>
          <p className="text-xs opacity-50">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded transition ${
                location.pathname === item.path
                  ? 'bg-[#B8966A] text-[#0E0E0E] font-bold'
                  : 'hover:bg-[#B8966A]/10'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[#B8966A]/20">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded hover:bg-red-500/20 text-red-400 transition"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-[#171714] border-b border-[#B8966A]/20 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold">
            {navItems.find(n => n.path === location.pathname)?.label || 'Admin'}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm opacity-70">Administrator</span>
            <div className="w-8 h-8 rounded-full bg-[#B8966A] text-[#0E0E0E] flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
