import PropTypes from 'prop-types';
import { useState } from 'react';
import { z } from 'zod';

function ForgotPasswordModal({ onClose, openLogin }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const switchModal = (modalFunc) => {
    onClose();
    setTimeout(() => modalFunc(), 300);
  };

  const forgotSchema = z.object({
    email: z.string().email('Invalid email'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = forgotSchema.safeParse({ email });
    if (!result.success) {
      setStatus(result.error.errors[0].message);
      setIsError(true);
      return;
    }
    setIsError(false);
    setStatus('');
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send reset link');
      setStatus('A reset link has been sent to your email.');
      setIsError(false);
    } catch (error) {
      setStatus(error.message || 'Failed to send reset link');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-70"
        onClick={onClose}
      ></div>
      <div className="bg-gray-800 text-white p-8 rounded shadow-lg z-10 max-w-md w-full">
        <h2 className="text-2xl mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 mb-4 rounded bg-gray-700"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-600"
          >
            {loading ? 'Sending...' : 'Reset Password'}
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
            onClick={() => switchModal(openLogin)}
            className="text-blue-400 hover:underline"
          >
            Back to Login
          </button>
        </div>
        <button onClick={onClose} className="mt-4 text-red-500 hover:underline">
          Close
        </button>
      </div>
    </div>
  );
}

ForgotPasswordModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  openLogin: PropTypes.func.isRequired,
};

export default ForgotPasswordModal;
