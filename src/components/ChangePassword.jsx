import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus('Passwords do not match.');
      setIsError(true);
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/change-password`,
        {
          token,
          password,
        }
      );
      setStatus('Password changed successfully! Redirecting to login...');
      setIsError(false);
      setTimeout(() => {
        navigate('/'); // Redirect to login page or landing page
      }, 1500);
    } catch (error) {
      const errMsg =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        'Password change failed';
      setStatus(errMsg);
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="bg-gray-800 p-8 rounded shadow-lg w-full max-w-md transform transition duration-300 ease-in-out">
        <h2 className="text-2xl mb-4 text-center">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block mb-1 font-medium">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Change Password
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
      </div>
    </div>
  );
};

export default ChangePassword;
