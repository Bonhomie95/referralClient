import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaChartLine,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

const sidebarItems = [
  { name: 'Home', icon: <FaHome />, route: '/dashboard/home' },
  {
    name: 'Investments',
    icon: <FaChartLine />,
    route: '/dashboard/investments',
  },
  { name: 'Profile', icon: <FaUser />, route: '/dashboard/profile' },
  { name: 'Settings', icon: <FaCog />, route: '/dashboard/settings' },
  { name: 'Referral History', icon: <FaCog />, route: '/dashboard/referral-history' },
];

const UserSidebar = ({ onLogout }) => {
  // Collapse by default on mobile (width ≤768)
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 768);

  // Optional: update collapse on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setCollapsed(!collapsed);

  // When a link is clicked on mobile, collapse sidebar.
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setCollapsed(true);
    }
  };

  return (
    <div
      className={`flex flex-col bg-gray-800 text-white h-full md:h-screen  p-4 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header with toggle button */}
      <div className="flex items-center justify-between">
        {!collapsed && <h1 className="text-xl font-bold">Dashboard</h1>}
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none"
        >
          {collapsed ? <FaBars /> : <FaTimes />}
        </button>
      </div>
      {/* Navigation Items */}
      <nav className="mt-8 flex-1">
        {sidebarItems.map((item, index) => (
          <Link
            key={index}
            to={item.route}
            onClick={handleLinkClick}
            className="flex items-center p-2 my-2 rounded hover:bg-gray-700"
          >
            <div className="text-lg">{item.icon}</div>
            {!collapsed && <span className="ml-4">{item.name}</span>}
          </Link>
        ))}
      </nav>
     
      <div className="mt-auto">
        <button
          onClick={onLogout}
          className="flex items-center p-2 rounded hover:bg-gray-700 w-full focus:outline-none"
        >
          <div className="text-lg">
            <FaSignOutAlt />
          </div>
          {!collapsed && <span className="ml-4">Logout</span>}
        </button>
      </div>
    </div>
  );
};

UserSidebar.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default UserSidebar;
