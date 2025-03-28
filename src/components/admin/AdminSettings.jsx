import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminSettings = () => {
  const [admin, setAdmin] = useState({ username: '', email: '' });
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Simulated admin info fetch (replace with real route if you build profile endpoint)
    const stored = JSON.parse(localStorage.getItem('adminInfo'));
    if (stored) setAdmin(stored);
  }, []);

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 5) {
      return setStatus('Password must be at least 5 characters.');
    }

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/update-password`,
        { password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );
      setStatus(res.data.message || 'Password updated successfully');
      setNewPassword('');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white text-black p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Admin Settings</h2>

      <p className="mb-2"><strong>Username:</strong> {admin.username}</p>
      <p className="mb-4"><strong>Email:</strong> {admin.email}</p>

      <label className="block mb-1">Update Password</label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
        placeholder="Enter new password"
      />
      <button
        onClick={handleUpdatePassword}
        className="px-4 py-2 bg-blue-600 text-white rounded w-full"
      >
        Save Password
      </button>

      {status && <p className="mt-4 text-sm text-center text-red-600">{status}</p>}
    </div>
  );
};

export default AdminSettings;
