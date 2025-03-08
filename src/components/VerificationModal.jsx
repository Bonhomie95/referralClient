import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';

function VerificationModal({ onClose, onVerified, email }) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-email`,
        { email, code }
      );
      if (res.data.success) {
        setStatus('Registration successful! Redirecting to login page...');
        setIsError(false);
        onClose();
        setTimeout(() => {
          onVerified();
        }, 1500);
      }
    } catch (error) {
      const errMsg =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        'Verification failed';
      setStatus(errMsg);
      setIsError(true);
    }
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
        <h2 className="text-2xl mb-4">Verify Your Email</h2>
        <p className="mb-4">
          A verification code has been sent to {email}. Please enter it below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter verification code"
            required
            className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Verify Code
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
        <button
          onClick={onClose}
          className="mt-4 text-red-500 hover:underline"
        >
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