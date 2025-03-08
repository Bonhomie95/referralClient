import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { FaBell } from 'react-icons/fa';

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000");

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      socket.emit('join', userId);
    }
    socket.on('notification', (data) => {
      setNotifications((prev) => [...prev, data]);
    });
    return () => {
      socket.off('notification');
    };
  }, []);

  const markAllAsRead = () => {
    setNotifications([]);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="text-white relative"
      >
        <FaBell size={24} />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs">
            {notifications.length}
          </span>
        )}
      </button>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-700 rounded shadow-lg z-50">
          <div className="p-2 border-b border-gray-600 flex justify-between items-center">
            <span className="text-sm font-semibold">Notifications</span>
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-300 hover:underline"
            >
              Mark all as read
            </button>
          </div>
          {notifications.length === 0 ? (
            <p className="p-2 text-sm">No new notifications</p>
          ) : (
            <ul className="max-h-64 overflow-y-auto">
              {notifications.map((notif, index) => (
                <li
                  key={index}
                  className="p-2 border-b border-gray-600 text-sm"
                >
                  {notif.message}
                  <div className="text-xs text-gray-400">
                    {new Date(notif.timestamp).toLocaleTimeString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
