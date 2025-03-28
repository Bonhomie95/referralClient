// src/components/PaymentStatus.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const status = new URLSearchParams(location.search).get('status');

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard/home');
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-center px-4">
      <div className="bg-gray-800 p-8 rounded shadow-md max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">
          {isSuccess ? '✅ Payment Successful' : '❌ Payment Failed'}
        </h2>
        <p className="mb-6">
          {isSuccess
            ? 'Your payment has been received. You will be redirected to your dashboard in 5 seconds.'
            : 'There was a problem verifying your payment. You will be redirected to your dashboard shortly.'}
        </p>
        <p>
          Or{' '}
          <span
            onClick={() => navigate('/dashboard/home')}
            className="text-blue-400 underline cursor-pointer"
          >
            click here
          </span>{' '}
          to continue now.
        </p>
      </div>
    </div>
  );
};

export default PaymentStatus;
