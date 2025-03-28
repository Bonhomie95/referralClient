import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import axios from 'axios';

function VerificationModal({ onClose, onVerified, email }) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setStatus('');
    setIsError(false);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-email`,
        { email, code }
      );

      if (res.data.success) {
        setStatus('Verification successful! Redirecting...');
        setTimeout(() => {
          onClose();
          onVerified();
        }, 1500);
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.message || error.message || 'Verification failed';
      setStatus(errMsg);
      setIsError(true);
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setStatus('');
    setIsError(false);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/resend-code`,
        { email }
      );
      setStatus(res.data.message);
    } catch (error) {
      const errMsg =
        error.response?.data?.message || error.message || 'Failed to resend code';
      setStatus(errMsg);
      setIsError(true);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-70"
        onClick={onClose}
      ></div>
      <div className="bg-gray-800 text-white p-8 rounded shadow-lg z-10 transform transition duration-300 ease-in-out w-full max-w-md">
        <h2 className="text-2xl mb-4">Verify Your Email</h2>
        <p className="mb-4">
          A verification code has been sent to <strong>{email}</strong>. Please enter it below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            required
            ref={inputRef}
            autoFocus
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          />
          <button
            type="submit"
            disabled={verifying}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
          >
            {verifying ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
        <button
          onClick={handleResend}
          disabled={resending}
          className="mt-3 text-sm text-blue-400 hover:underline disabled:opacity-50"
        >
          {resending ? 'Resending...' : 'Resend Code'}
        </button>
        {status && (
          <p
            className={`mt-4 text-center text-sm ${
              isError ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {status}
          </p>
        )}
        <button onClick={onClose} className="mt-4 text-red-500 hover:underline">
          Close
        </button>
      </div>
    </div>
  );
}

VerificationModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onVerified: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
};

export default VerificationModal;
