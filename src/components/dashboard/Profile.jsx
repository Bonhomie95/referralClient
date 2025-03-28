import { useState, useEffect } from 'react';
// import nigerianBanks from '../../constants/nigerianBanks';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    bankCode: '',
    bankAccountNumber: '',
    bankAccountName: '',
  });

  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const [banks, setBanks] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data);
        setBankDetails({
          bankName: res.data.bankName || '',
          bankAccountNumber: res.data.bankAccountNumber || '',
          bankAccountName: res.data.fullname || '',
        });
      })
      .catch((err) => console.error('Profile fetch error:', err));
  }, [token]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get('https://api.paystack.co/bank', {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PAYSTACK_SECRET_KEY}`,
          },
        });
        setBanks(response.data.data); // Paystack returns array under `data`
      } catch (err) {
        console.error('Error fetching banks:', err);
      }
    };

    fetchBanks();
  }, []);
  const handleBankDetailChange = (e) => {
    const { name, value } = e.target;

    // For account number: enforce numeric-only input
    if (name === 'bankAccountNumber' && !/^\d*$/.test(value)) return;

    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  const updateBankDetails = async () => {
    // Validation
    if (!/^\d{10}$/.test(bankDetails.bankAccountNumber)) {
      setNotification('Account number must be exactly 10 digits.');
      return;
    }

    if (
      profile.fullname.trim().toLowerCase() !==
      bankDetails.bankAccountName.trim().toLowerCase()
    ) {
      setNotification('Account name does not match your registered name.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/update-bank-details`,
        { ...bankDetails, bankAccountName: profile.fullname }, // Force it to always match,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotification(res.data.message);
      setProfile((prev) => ({ ...prev, ...bankDetails }));
    } catch (error) {
      setNotification(
        error.response?.data?.message ||
          error.message ||
          'Failed to update bank details'
      );
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(''), 4000);
    }
  };

  if (!profile) return <p className="text-white p-8">Loading profile...</p>;

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
            value={bankDetails.bankCode}
            onChange={(e) => {
              const selected = banks.find((b) => b.code === e.target.value);
              setBankDetails((prev) => ({
                ...prev,
                bankName: selected.name,
                bankCode: selected.code,
              }));
            }}
            className="w-full p-2 bg-gray-700 rounded"
          >
            <option value="">Select Bank</option>
            {banks.filter((bank, index, self) => self.indexOf(bank) === index).map((bank, index) => (
              <option key={`${bank}-${index}`} value={bank.code}>{bank.name}</option>))}
          </select>
        </div>
        <div>
          <label className="font-medium">Account Number</label>
          <input
            type="text"
            name="bankAccountNumber"
            value={bankDetails?.bankAccountNumber}
            onChange={handleBankDetailChange}
            className="w-full p-2 bg-gray-700 rounded"
            maxLength={10}
            placeholder="10-digit Account Number"
          />
        </div>
        <div>
          <label className="font-medium">Account Name</label>
          <input
            type="text"
            name="bankAccountName"
            value={profile?.fullname || ''}
            readOnly
            onChange={handleBankDetailChange}
            className="w-full p-2 bg-gray-700 rounded"
            placeholder="Must match your registered name"
          />
        </div>
        <button
          onClick={updateBankDetails}
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Updating...' : 'Update Bank Details'}
        </button>
      </div>

      {notification && (
        <p className="mt-4 text-center text-sm bg-gray-600 p-2 rounded">
          {notification}
        </p>
      )}
    </div>
  );
};

export default Profile;
