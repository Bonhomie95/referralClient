import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  LogOut,
  Menu,
} from 'lucide-react';

const AdminSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768); // collapsed on mobile by default

  const navItems = [
    { label: 'Home', path: '/admin/home', icon: <LayoutDashboard size={20} /> },
    { label: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    {
      label: 'Analytics',
      path: '/admin/analytics',
      icon: <BarChart3 size={20} />,
    },
    {
      label: 'Referral Bonuses',
      path: '/admin/referral-bonuses',
      icon: <Users size={20} />,
    },
    {
      label: 'Settings',
      path: '/admin/settings',
      icon: <Settings size={20} />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <aside
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } bg-gray-900 text-white h-screen flex flex-col transition-all duration-300`}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        {!collapsed && <h2 className="text-xl font-bold">Admin</h2>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="md:block text-gray-400 hover:text-white"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 ${
              pathname === item.path ? 'bg-blue-600' : ''
            }`}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-auto mb-4 px-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
