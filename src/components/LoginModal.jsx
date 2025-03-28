import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const LoginModal = ({ onClose, onLoginSuccess, openRegister, openForgot }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [twoFARequired, setTwoFARequired] = useState(false);
  const [otp, setOtp] = useState('');
  const otpRef = useRef(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        form
      );
      if (res.data.twoFARequired) {
        setTwoFARequired(true);
        setStatus('OTP sent to your email.');
      } else if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.user.id);
        localStorage.setItem('userEmail', res.data.user.email);
        localStorage.setItem('fullName', res.data.user.fullname);
        setStatus('Login successful! Redirecting...');
        setTimeout(() => onLoginSuccess(res.data.token), 1500);
      }
    } catch (error) {
      setStatus(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-otp-login`,
        { email: form.email, otp }
      );
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('userEmail', res.data.user.email);
      localStorage.setItem('fullName', res.data.user.fullname);
      setStatus('Login successful! Redirecting...');
      setTimeout(() => onLoginSuccess(res.data.token), 1500);
    } catch (error) {
      setStatus(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (twoFARequired && otpRef.current) {
      otpRef.current.focus();
    }
  }, [twoFARequired]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-70"
        onClick={onClose}
      ></div>
      <div className="bg-gray-800 text-white p-8 rounded shadow-lg z-10 w-full max-w-md">
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
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:bg-gray-600"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <p>Enter the OTP sent to your email</p>
            <input
              type="text"
              ref={otpRef}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full p-2 bg-gray-700 rounded"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:bg-gray-600"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}

        {status && (
          <p className="mt-4 text-center text-sm text-yellow-400">{status}</p>
        )}

        <div className="mt-4 flex justify-between text-sm">
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
