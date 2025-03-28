import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function RegistrationModal({ onClose, openLogin, onRegistered }) {
  const [form, setForm] = useState({ fullname: '', email: '', password: '' });
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [allowedPlans, setAllowedPlans] = useState([]);
  const location = useLocation();
  const referralCode = new URLSearchParams(location.search).get('ref');

  useEffect(() => {
    if (referralCode) {
      axios
        .get(
          `${
            import.meta.env.VITE_API_URL
          }/api/investments/referral-plan/${referralCode}`
        )
        .then((res) => setAllowedPlans(res.data.allowedPlans))
        .catch((err) => console.error(err));
    } else {
      setAllowedPlans([5000, 10000, 20000, 50000, 100000]);
    }
  }, [referralCode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          ...form,
          ...(referralCode && { referralCode }), // Add referral code if available
        }
      );
      if (res.status === 201) {
        setStatus('Verification code sent! Check your email.');
        setIsError(false);
        onRegistered(form.email);
      }
    } catch (error) {
      setStatus(error.response?.data?.message || 'Registration failed');
      setIsError(true);
    }
  };

  const switchToLogin = () => {
    onClose();
    setTimeout(() => openLogin(), 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-70"
        onClick={onClose}
      ></div>
      <div className="bg-gray-800 text-white p-8 rounded shadow-lg z-10 transform transition duration-300 ease-in-out">
        <h2 className="text-2xl mb-4">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={form.fullname}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700"
          />
          {referralCode && (
            <p className="text-sm text-green-400 text-center">
              Referral code detected. You’ll receive special plan access.
            </p>
          )}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
          >
            Register
          </button>
        </form>
        {status && (
          <p
            className={`mt-4 text-center text-sm ${
              isError ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {status}
          </p>
        )}
        <div className="mt-4">
          <button
            onClick={switchToLogin}
            className="text-blue-400 hover:underline"
          >
            Already have an account? Login
          </button>
        </div>
        <button onClick={onClose} className="mt-4 text-red-500 hover:underline">
          Close
        </button>
      </div>
    </div>
  );
}

RegistrationModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  openLogin: PropTypes.func.isRequired,
  onRegistered: PropTypes.func.isRequired,
};

export default RegistrationModal;
