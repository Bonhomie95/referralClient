import { useState, useEffect } from 'react';
import nigerianBanks from "../../constants/nigerianBanks";
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    bankAccountNumber: "",
    bankAccountName: ""
  });
  const [notification, setNotification] = useState('');

  // Fetch profile from backend using the token for authentication.
  const token = localStorage.getItem('token');
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setPhone(res.data.phone || '');
      })
      .catch((err) => console.error('Profile fetch error:', err));
  }, [token]);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSendCode = async () => {
    if (!phone) {
      alert('Please enter a valid phone number');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/send-otp`,
        { phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('OTP sent:', res.data.otp); // For testing only; in production, do not log OTP.
      setOtpSent(true);
      setNotification('OTP sent to your phone.');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setNotification('Failed to send OTP.');
    }
  };

  const handleVerifyOtp = async () => {
    if (otpInput.trim().length !== 6) {
      alert('Please enter a 6-digit code');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/update-phone`,
        { phone, otp: otpInput },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotification('Phone number updated successfully!');
      setEditing(false);
      setOtpSent(false);
      setOtpInput('');
      console.log(res.data);
      // Refresh profile data
      const profileRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(profileRes.data);
    } catch (error) {
      console.error('Error updating phone:', error);
      setNotification(
        error.response?.data?.message || 'Failed to update phone number'
      );
    }
  };

  
  const handleBankDetailChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  const updateBankDetails = async () => {
    // Check if account name matches the registered name for security
    if (profile.fullname.trim().toLowerCase() !== bankDetails.bankAccountName.trim().toLowerCase()) {
      setNotification("Account name does not match your registered name.");
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/update-bank-details`,
        bankDetails,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotification(res.data.message);
      // Optionally, update the profile with new bank details
      setProfile((prev) => ({ ...prev, ...bankDetails }));
    } catch (error) {
      setNotification(
        error.response?.data?.message || error.message || "Failed to update bank details"
      );
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="font-medium">Full Name</label>
          <input
            type="text"
            value={profile.fullname}
            readOnly
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>
        <div>
          <label className="font-medium">Email Address</label>
          <input
            type="email"
            value={profile.email}
            readOnly
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>
        <div>
          <label className="font-medium">Phone Number</label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              readOnly={!editing}
              className="w-full p-2 bg-gray-700 rounded"
            />
            {!editing ? (
              <button
                onClick={handleEditClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={handleSendCode}
                className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap px-3 py-2 rounded"
              >
                Send Code
              </button>
            )}
          </div>
          {otpSent && editing && (
            <div className="mt-2 flex space-x-2">
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded"
              />
              <button
                onClick={handleVerifyOtp}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
              >
                Verify
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="font-medium">Total Invested Plans</label>
          <input
            type="text"
            value={profile.totalInvestments}
            readOnly
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>
        <div>
          <label className="font-medium">Active Investments</label>
          <input
            type="text"
            value={profile.activeInvestments}
            readOnly
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>
      </div>
      <div className="mt-8 space-y-4">
        <h3 className="text-xl font-bold">Bank Details</h3>
        <div>
          <label className="font-medium">Bank Name</label>
          <select
            name="bankName"
            value={bankDetails.bankName}
            onChange={handleBankDetailChange}
            className="w-full p-2 bg-gray-700 rounded"
          >
            <option value="">Select Bank</option>
            {nigerianBanks.map((bank, index) => (
              <option key={index} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-medium">Account Number</label>
          <input
            type="text"
            name="bankAccountNumber"
            value={bankDetails.bankAccountNumber}
            onChange={handleBankDetailChange}
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>
        <div>
          <label className="font-medium">Account Name</label>
          <input
            type="text"
            name="bankAccountName"
            value={bankDetails.bankAccountName}
            onChange={handleBankDetailChange}
            className="w-full p-2 bg-gray-700 rounded"
            placeholder="Must match your registered name"
          />
        </div>
        <button
          onClick={updateBankDetails}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Update Bank Details
        </button>
      </div>
      {notification && <p className="mt-4 text-center text-sm bg-gray-600 p-2 rounded">{notification}</p>}
    </div>
  );
};

export default Profile;
