import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaChartBar,
  FaFileAlt,
  FaUserShield,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

const adminItems = [
  { name: 'Users', icon: <FaUsers />, route: '/admin/users' },
  { name: 'Investments', icon: <FaChartBar />, route: '/admin/investments' },
  { name: 'Referrals', icon: <FaFileAlt />, route: '/admin/referrals' },
  { name: 'Reports', icon: <FaUserShield />, route: '/admin/reports' },
];

const AdminSidebar = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div
      className={`flex flex-col bg-gray-800 text-white h-full p-4 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between">
        {!collapsed && <h2 className="text-xl font-bold">Admin Panel</h2>}
        <button onClick={toggleSidebar} className="focus:outline-none">
          {collapsed ? <FaBars /> : <FaTimes />}
        </button>
      </div>
      <nav className="mt-8 flex-1">
        {adminItems.map((item, index) => (
          <Link
            key={index}
            to={item.route}
            className="flex items-center p-2 my-2 rounded hover:bg-gray-700"
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && <span className="ml-4">{item.name}</span>}
          </Link>
        ))}
      </nav>
      <div className="mt-auto">
        <button
          onClick={onLogout}
          className="flex items-center p-2 rounded hover:bg-gray-700 w-full focus:outline-none"
        >
          <FaSignOutAlt className="text-lg" />
          {!collapsed && <span className="ml-4">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
