import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/notifications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (id) => {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/notifications/${id}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/notifications/mark-all-read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        className="relative"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 text-white rounded shadow-lg z-50 p-4 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">Notifications</h3>
            <button
              onClick={markAllAsRead}
              className="text-sm text-blue-400 hover:underline"
            >
              Mark all as read
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-gray-400">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-3 mb-2 rounded ${
                  !n.read ? 'bg-gray-700' : 'bg-gray-900'
                }`}
              >
                <p>{n.message}</p>
                {!n.read && (
                  <button
                    onClick={() => markAsRead(n._id)}
                    className="text-blue-400 text-sm mt-1"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
