import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan || null;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!plan) {
      navigate('/dashboard/home');
    }
  }, [plan, navigate]);

  const handlePayNow = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('userEmail'); // Ensure you store userEmail during login
      const amount = plan.price; // amount in NGN
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/initialize`,
        {
          email,
          amount,
          callback_url: `${window.location.origin}/payment/callback`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // The response from Paystack includes an authorization_url to which we redirect the user
      const { authorization_url } = response.data.data;
      window.location.href = authorization_url;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Payment initialization failed'
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Payment</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <p>
            <strong>Plan:</strong> {plan?.name}
          </p>
          <p>
            <strong>Amount to Pay:</strong> {plan?.price} NGN
          </p>
          <p>
            <strong>Bank Name:</strong> XYZ Bank
          </p>
          <p>
            <strong>Account Number:</strong> 1234567890
          </p>
          <p>
            <strong>Account Name:</strong> Investment Platform
          </p>
        </div>
        <button
          onClick={handlePayNow}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
        <button
          onClick={() => navigate('/dashboard/home')}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
