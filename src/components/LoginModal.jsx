import { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const LoginModal = ({ onClose, onLoginSuccess, openRegister, openForgot }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('');
  const [twoFARequired, setTwoFARequired] = useState(false);
  const [otp, setOtp] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        form
      );
      if (res.data.twoFARequired) {
        setTwoFARequired(true);
        setStatus('OTP sent to your email. Please enter the code.');
      } else if (res.data.token) {
        setStatus('Login successful!');
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.user.id);
        onLoginSuccess(res.data.token);
      }
    } catch (error) {
      const errMsg =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        'Login failed';
      setStatus(errMsg);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-otp-login`,
        { email: form.email, otp }
      );
      if (res.data.token) {
        setStatus('Login successful!');
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.user.id);
        onLoginSuccess(res.data.token);
      }
    } catch (error) {
      const errMsg =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        'OTP verification failed';
      setStatus(errMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-70"
        onClick={onClose}
      ></div>
      <div className="bg-gray-800 text-white p-8 rounded shadow-lg z-10 transform transition duration-300">
        <h2 className="text-2xl mb-4">Login</h2>
        {!twoFARequired ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-700 rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-700 rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              Login
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <p>Enter the 6-digit OTP sent to your email</p>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
              Verify OTP
            </button>
          </div>
        )}
        {status && <p className="mt-4 text-center text-sm">{status}</p>}
        <div className="mt-4 flex justify-between">
          <button
            onClick={openRegister}
            className="text-blue-400 hover:underline"
          >
            Register
          </button>
          <button
            onClick={openForgot}
            className="text-blue-400 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
        <button onClick={onClose} className="mt-4 text-red-500 hover:underline">
          Close
        </button>
      </div>
    </div>
  );
};

LoginModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onLoginSuccess: PropTypes.func.isRequired,
  openRegister: PropTypes.func.isRequired,
  openForgot: PropTypes.func.isRequired,
};

export default LoginModal;
