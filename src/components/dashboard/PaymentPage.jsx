import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan || null;
  const referralLink = new URLSearchParams(location.search).get('ref'); // 👈 Get referral
  const [allowedPlans, setAllowedPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!plan) {
      navigate('/dashboard/home');
    }

    const fetchAllowedPlans = async () => {
      try {
        if (referralLink) {
          const res = await axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/api/investments/referral-plan/${referralLink}`
          );
          setAllowedPlans(res.data.allowedPlans);
        } else {
          setAllowedPlans([5000, 10000, 20000, 35000, 50000, 75000, 100000]);

        }
      } catch (error) {
        console.error('Failed to fetch allowed plans:', error.message);
        setAllowedPlans([5000, 10000, 20000, 35000, 50000, 75000, 100000]);

      }
    };

    fetchAllowedPlans();
  }, [plan, referralLink, navigate]);

  const handlePayNow = async () => {
    if (!allowedPlans.includes(plan.price)) {
      return setError(
        `Plan of ₦${plan.price} is not allowed under this referral.`
      );
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('userEmail');
      const amount = plan.price;
      const planId = plan.id;

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/initialize`,
        {
          planId,
          email,
          amount,
          callback_url: `${window.location.origin}/payment/callback`,
          ...(referralLink && { referralLink }), // 👈 pass referralLink to backend
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { authorization_url } = response.data.data;
      window.location.href = authorization_url;
    } catch (err) {
      setError(err.response?.data?.message || 'Payment initialization failed');
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
            <strong>Amount to Pay:</strong> ₦{plan?.price}
          </p>
        </div>
        <button
          onClick={handlePayNow}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          {loading ? 'Processing...' : 'Pay Now with Paystack'}
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
