import { useState, useEffect } from 'react';
import axios from 'axios';
import { z } from 'zod';
import ConfirmationModal from '../ConfirmationModal';

const Settings = () => {
  const [profile, setProfile] = useState(null);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [pendingToggle2FA, setPendingToggle2FA] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [notification, setNotification] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
    code: '',
    twoFACode: '',
  });
  const [step, setStep] = useState('request');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletionCode, setDeletionCode] = useState('');
  const [requireCodeInput, setRequireCodeInput] = useState(false);

  const token = localStorage.getItem('token');

  const passwordSchema = z
    .object({
      newPassword: z.string().min(6, 'Password must be at least 6 characters'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });

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

  const toggleReferralEmailNotifications = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/toggle-referral-emails`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile((prev) => ({
        ...prev,
        receiveReferralEmails: res.data.receiveReferralEmails,
      }));
      setNotification(res.data.message);
      autoClearNotification();
    } catch (err) {
      setNotification(
        err.response?.data?.message || 'Failed to toggle email setting.'
      );
      autoClearNotification();
    }
  };

  const handleToggle2FA = (desiredState) => {
    setOtpInput('');
    setPendingToggle2FA(desiredState);
    setIsLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/user/send-2fa-code`,
        { enable: desiredState },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setOtpSent(true);
        setNotification('A confirmation code has been sent to your email.');
        autoClearNotification();
      })
      .catch((err) => {
        console.error('Error sending 2FA code:', err);
        setNotification('Failed to send confirmation code.');
        autoClearNotification();
      })
      .finally(() => setIsLoading(false));
  };

  const handleVerify2FA = () => {
    setIsLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/user/update-2fa`,
        { code: otpInput, enable: pendingToggle2FA },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setTwoFAEnabled(pendingToggle2FA);
        setNotification('2FA status updated successfully.');
        setOtpSent(false);
        setOtpInput('');
        autoClearNotification();
      })
      .catch((err) => {
        console.error('Error updating 2FA:', err);
        setNotification(err.response?.data?.message || 'Failed to update 2FA.');
        autoClearNotification();
      })
      .finally(() => setIsLoading(false));
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const requestResetCode = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/send-reset-code`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStep('verify');
      setNotification('Code sent successfully.');
      autoClearNotification();
      const profile = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTwoFactorEnabled(profile.data.twoFactorEnabled);
    } catch (err) {
      setNotification(err.response?.data?.message || 'Error sending code');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword, code } = passwordData;

    const result = passwordSchema.safeParse(passwordData);
    if (!result.success) {
      setNotification(result.error.errors[0].message);
      return autoClearNotification();
    }

    if (newPassword !== confirmPassword) {
      setNotification('Passwords do not match.');
      return autoClearNotification();
    }

    if (twoFAEnabled && step === 'verify' && !code) {
      setNotification('Verification code is required.');
      return autoClearNotification();
    }
    setIsLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/update-password`,
        {
          newPassword,
          code: twoFAEnabled ? code : undefined, // only send code if 2FA is enabled
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotification('Password updated successfully.');
      setPasswordData({
        newPassword: '',
        confirmPassword: '',
        code: '',
      });
      setStep('request'); // reset step back to request
    } catch (err) {
      console.error('Error updating password:', err);
      setNotification(
        err.response?.data?.message || 'Failed to update password.'
      );
    } finally {
      autoClearNotification();
      setIsLoading(false);
    }
  };

  const confirmDeleteRequest = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.twoFAEnabled) {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/send-delete-code`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRequireCodeInput(true);
        setNotification('Verification code sent to your email.');
      } else {
        handleDeleteProfile(); // direct deletion
      }
    } catch (err) {
      setNotification(
        err.response?.data?.message || 'Error verifying delete step.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/delete-profile`,
        {
          data: { code: deletionCode }, // added conditionally
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotification('Profile deleted successfully.');
      setTimeout(() => {
        localStorage.removeItem('token');
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      setNotification(
        err.response?.data?.message || 'Failed to delete profile.'
      );
    }
  };

  const autoClearNotification = () => {
    setTimeout(() => setNotification(''), 4000);
  };

  if (!profile) return <p className="text-white p-8">Loading Settings...</p>;
  {
    twoFactorEnabled && null;
  }
  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">
          Two-Factor Authentication
        </h3>
        <p className="flex items-center gap-2">
          Status: {twoFAEnabled ? 'Enabled ✅' : 'Disabled 🔓'}
        </p>
        <button
          onClick={() => handleToggle2FA(!twoFAEnabled)}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading
            ? 'Processing...'
            : twoFAEnabled
            ? 'Disable 2FA'
            : 'Enable 2FA'}
        </button>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">
            Referral Bonus Email Notifications
          </h3>
          <p className="flex items-center gap-2">
            Status:{' '}
            {profile?.receiveReferralEmails ? 'Enabled ✅' : 'Disabled 🔕'}
          </p>
          <button
            onClick={toggleReferralEmailNotifications}
            className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {profile?.receiveReferralEmails
              ? 'Disable Referral Emails'
              : 'Enable Referral Emails'}
          </button>
        </div>

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
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Confirm'}
            </button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Update Password</h3>

        {/* 2FA Disabled Flow */}
        {!twoFAEnabled && (
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
              placeholder="Confirm Password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 bg-gray-700 rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        {/* 2FA Enabled Flow */}
        {twoFAEnabled && (
          <>
            {step === 'request' && (
              <button
                type="submit"
                onClick={requestResetCode}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-4"
                disabled={isLoading}
              >
                {isLoading
                  ? 'Sending Code to Email...'
                  : 'Send Verification Code to Email'}
              </button>
            )}

            {step === 'verify' && (
              <form onSubmit={handleUpdatePassword} className="space-y-2">
                <input
                  type="text"
                  name="code"
                  placeholder="Verification Code"
                  value={passwordData.code}
                  onChange={handlePasswordChange}
                  className="w-full p-2 bg-gray-700 rounded"
                  required
                />
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
                  placeholder="Confirm Password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-2 bg-gray-700 rounded"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}
          </>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Delete Profile</h3>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Please wait...' : 'Delete Profile'}
        </button>
      </div>

      {notification && (
        <p className="mt-4 text-center text-sm bg-gray-600 p-2 rounded">
          {notification}
        </p>
      )}

      {showDeleteModal && (
        <div className="p-4 bg-gray-700 rounded">
          {!requireCodeInput ? (
            <ConfirmationModal
              isOpen={true}
              message="Are you sure you want to delete your profile? This action cannot be undone."
              onConfirm={confirmDeleteRequest}
              onCancel={() => setShowDeleteModal(false)}
            />
          ) : (
            <div>
              <input
                type="text"
                value={deletionCode}
                onChange={(e) => setDeletionCode(e.target.value)}
                placeholder="Enter verification code"
                className="w-full mb-2 p-2 rounded bg-gray-600 text-white"
              />
              <button
                onClick={handleDeleteProfile}
                disabled={isLoading}
                className="bg-red-600 text-white w-full py-2 rounded disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Confirm Deletion'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Settings;
