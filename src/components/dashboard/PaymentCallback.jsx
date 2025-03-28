import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [statusMessage, setStatusMessage] = useState(
    'Verifying payment, please wait...'
  );

  useEffect(() => {
    const verifyPayment = async () => {
      const urlParams = new URLSearchParams(location.search);
      const reference = urlParams.get('reference');
      const token = localStorage.getItem('token');

      if (!reference || !token) {
        setStatusMessage('Missing reference or authentication. Redirecting...');
        return setTimeout(() => navigate('/dashboard/home'), 2000);
      }

      try {
        await axios.get(
          `${import.meta.env.VITE_API_URL}/api/payment/verify/${reference}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStatusMessage('✅ Payment successful! Redirecting...');
        setTimeout(() => navigate('/payment-status?status=success'), 1500);
      } catch (error) {
        setStatusMessage('❌ Payment verification failed. Redirecting...');
        console.error(error.response?.data?.message || error.message);
        setTimeout(() => navigate('/payment-status?status=failed'), 2000);
      }
    };

    verifyPayment();
  }, [location, navigate]);

  return (
    <div className="text-white text-center mt-20 text-lg animate-pulse">
      {statusMessage}
    </div>
  );
};

export default PaymentCallback;
