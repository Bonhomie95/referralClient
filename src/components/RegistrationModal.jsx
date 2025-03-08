import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';

function RegistrationModal({ onClose, openLogin, onRegistered }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        form
      );
      setStatus(res.data.message || 'Registration successful!');
      setIsError(false);
      onClose();
      setTimeout(() => {
        onRegistered(form.email);
      }, 300);
    } catch (error) {
      const errMsg =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        'Registration failed';
      setStatus(errMsg);
      setIsError(true);
    }
  };

  const switchToLogin = () => {
    onClose();
    setTimeout(() => {
      openLogin();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark overlay */}
      <div
        className="fixed inset-0 bg-black opacity-70"
        onClick={onClose}
      ></div>
      {/* Modal content */}
      <div className="bg-gray-800 text-white p-8 rounded shadow-lg z-10 transform transition duration-300 ease-in-out">
        <h2 className="text-2xl mb-4">Register</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={form.fullname}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700 mb-4"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700 mb-4"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700 mb-4"
          />
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
