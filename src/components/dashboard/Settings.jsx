import { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmationModal from '../ConfirmationModal';

const Settings = () => {
  const [profile, setProfile] = useState(null);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [toggleAttempt, setToggleAttempt] = useState(null); // the desired new value (true/false)
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [notification, setNotification] = useState('');
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Assume token is stored in localStorage and auth middleware sets req.user on backend.
  const token = localStorage.getItem('token');

  // Fetch profile from backend
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setTwoFAEnabled(res.data.twoFAEnabled);
      })
      .catch((err) => console.error('Error fetching profile:', err));
  }, [token]);

  // 2FA Toggle: when user clicks toggle, we ask for confirmation by sending an OTP to email.
  const handleToggle2FA = (desiredState) => {
    setOtpInput("");
    setToggleAttempt(desiredState);
    // Send code to user's email
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/user/send-2fa-code`,
        { enable: desiredState },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setOtpSent(true);
        setNotification('A confirmation code has been sent to your email.');
        console.log(res?.data);
      })
      .catch((err) => {
        console.error('Error sending 2FA code:', err);
        setNotification('Failed to send confirmation code.');
      });
  };

  const handleVerify2FA = () => {
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/user/update-2fa`,
        { code: otpInput, enable: toggleAttempt },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setTwoFAEnabled(toggleAttempt);
        setNotification('2FA status updated successfully.');
        setOtpSent(false);
        setOtpInput('');
        console.log(res?.data);
      })
      .catch((err) => {
        console.error('Error updating 2FA:', err);
        setNotification(err.response?.data?.message || 'Failed to update 2FA.');
      });
  };

  // Update password form
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification('Passwords do not match.');
      return;
    }
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/user/update-password`,
        { newPassword: passwordData.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setNotification('Password updated successfully.');
        setPasswordData({ newPassword: '', confirmPassword: '' });
        console.log(res?.data);
      })
      .catch((err) => {
        console.error('Error updating password:', err);
        setNotification(
          err.response?.data?.message || 'Failed to update password.'
        );
      });
  };

  // Delete profile
  const handleDeleteProfile = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/delete-profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotification('Profile deleted successfully.');
      setTimeout(() => {
        localStorage.removeItem('token');
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      console.error('Error deleting profile:', error);
      setNotification(
        error.response?.data?.message || 'Failed to delete profile.'
      );
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      {/* 2FA Toggle */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">
          Two-Factor Authentication
        </h3>
        <p>Current status: {twoFAEnabled ? 'Enabled' : 'Disabled'}</p>
        <button
          onClick={() => handleToggle2FA(!twoFAEnabled)}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {twoFAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
        </button>
        {otpSent && (
          <div className="mt-2 flex space-x-2">
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded"
            />
            <button
              onClick={handleVerify2FA}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
            >
              Confirm
            </button>
          </div>
        )}
      </div>

      {/* Update Password */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Update Password</h3>
        <form onSubmit={handleUpdatePassword} className="space-y-2">
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            className="w-full p-2 bg-gray-700 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Delete Profile */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Delete Profile</h3>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
        >
          Delete Profile
        </button>
      </div>

      {notification && (
        <p className="mt-4 text-center text-sm bg-gray-600 p-2 rounded">
          {notification}
        </p>
      )}

      {/* Confirmation Modal for Delete Profile */}
      {showDeleteModal && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          message="Are you sure you want to delete your profile? This action cannot be undone."
          onConfirm={handleDeleteProfile}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default Settings;
