import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const WithdrawalStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [statusMessage, setStatusMessage] = useState('Checking status...');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');

    if (status === 'success') {
      setIsSuccess(true);
      setStatusMessage('✅ Your withdrawal was successful!');
    } else {
      setIsSuccess(false);
      setStatusMessage('❌ There was a problem processing your withdrawal.');
    }

    const timer = setTimeout(() => {
      navigate('/dashboard/home');
    }, 5000);

    return () => clearTimeout(timer);
  }, [location, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white text-center px-6">
      <h2 className="text-2xl font-bold mb-4">{statusMessage}</h2>
      <p className="text-sm">
        You will be redirected to your dashboard in 5 seconds. <br />
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
  );
};

export default WithdrawalStatus;
