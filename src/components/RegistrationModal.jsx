import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { z } from 'zod'; // ✅ Import Zod

// ✅ Define schema
const registrationSchema = z.object({
  fullname: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

function RegistrationModal({ onClose, openLogin, onRegistered }) {
  const [form, setForm] = useState({ fullname: '', email: '', password: '' });
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [allowedPlans, setAllowedPlans] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const location = useLocation();

  const referralCode =
    new URLSearchParams(location.search).get('ref') ||
    localStorage.getItem('referralCode');

  useEffect(() => {
    const queryRef = new URLSearchParams(location.search).get('ref');
    if (queryRef) {
      localStorage.setItem('referralCode', queryRef);
    }
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
  }, [location.search, referralCode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate with Zod
    const result = registrationSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setValidationErrors(fieldErrors);
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          ...form,
          ...(referralCode && { referralCode }),
        }
      );

      if (res.status === 201) {
        setStatus('Verification code sent! Check your email.');
        setIsError(false);
        onRegistered(form.email);
        localStorage.removeItem('referralCode');
      }
    } catch (error) {
      setStatus(error.response?.data?.message || 'Registration failed');
      setIsError(true);
      localStorage.removeItem('referralCode');
    }
  };

  const switchToLogin = () => {
    onClose();
    setTimeout(() => openLogin(), 300);
  };

  {allowedPlans.length > 0 && null}
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-70"
        onClick={onClose}
      ></div>
      <div className="bg-gray-800 text-white p-8 rounded shadow-lg z-10 transform transition duration-300 ease-in-out w-full max-w-md">
        <h2 className="text-2xl mb-4">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={form.fullname}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700"
            />
            {validationErrors.fullname && (
              <p className="text-red-400 text-sm mt-1">
                {validationErrors.fullname}
              </p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700"
            />
            {validationErrors.email && (
              <p className="text-red-400 text-sm mt-1">
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700"
            />
            {validationErrors.password && (
              <p className="text-red-400 text-sm mt-1">
                {validationErrors.password}
              </p>
            )}
          </div>

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
