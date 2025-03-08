import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const WithdrawPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const investment = location.state?.investment;
  const [interestMsg, setInterestMsg] = useState('');
  const [commissionMsg, setCommissionMsg] = useState('');

  if (!investment) {
    navigate('/dashboard/investments');
    return null;
  }

  // Assume the backend returns computed virtual fields: interestBalance and commissionBalance
  const interestBalance = investment.interestBalance || 0;
  const commissionBalance = investment.commissionBalance || 0;
  const inviteesCount = investment.invitees || 0;

  // Calculate days since the investment start date
  const daysSinceStart = Math.floor(
    (new Date() - new Date(investment.startDate)) / (1000 * 60 * 60 * 24)
  );

  // Conditions:
  // Interest: must be >2000. If after day 7, must have at least 10 invitees.
  const canWithdrawInterest =
    interestBalance > 2000 &&
    (daysSinceStart <= 7 || (daysSinceStart >= 8 && inviteesCount >= 10));
  // Commission: must be >2000 and require at least 10 invitees.
  const canWithdrawCommission = commissionBalance > 2000 && inviteesCount >= 10;

  const handleWithdrawInterest = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/withdraw`,
        {
          type: 'interest',
          investmentId: investment._id,
          amount: interestBalance,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setInterestMsg('Interest withdrawal successful!');
    } catch (err) {
      setInterestMsg(
        err.response?.data?.message ||
          err.message ||
          'Interest withdrawal failed.'
      );
    }
  };

  const handleWithdrawCommission = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/withdraw`,
        {
          type: 'commission',
          investmentId: investment._id,
          amount: commissionBalance,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setCommissionMsg('Commission withdrawal successful!');
    } catch (err) {
      setCommissionMsg(
        err.response?.data?.message ||
          err.message ||
          'Commission withdrawal failed.'
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Withdraw Funds</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Interest Section */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Interest Balance</h3>
          <p className="text-xl font-bold">{interestBalance.toFixed(2)} NGN</p>
          <button
            onClick={handleWithdrawInterest}
            disabled={!canWithdrawInterest}
            className={`mt-2 w-full py-2 rounded ${
              canWithdrawInterest
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-500 cursor-not-allowed'
            }`}
          >
            Withdraw Interest
          </button>
          {interestMsg && <p className="mt-2 text-sm">{interestMsg}</p>}
          {daysSinceStart >= 8 && inviteesCount < 10 && (
            <p className="mt-1 text-xs text-yellow-300">
              Minimum 10 referrals required after 7 days.
            </p>
          )}
        </div>
        {/* Commission Section */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Commission Balance</h3>
          <p className="text-xl font-bold">
            {commissionBalance.toFixed(2)} NGN
          </p>
          <button
            onClick={handleWithdrawCommission}
            disabled={!canWithdrawCommission}
            className={`mt-2 w-full py-2 rounded ${
              canWithdrawCommission
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-500 cursor-not-allowed'
            }`}
          >
            Withdraw Commission
          </button>
          {commissionMsg && <p className="mt-2 text-sm">{commissionMsg}</p>}
          {inviteesCount < 10 && (
            <p className="mt-1 text-xs text-yellow-300">
              Minimum 10 referrals required.
            </p>
          )}
        </div>
      </div>
      <button
        onClick={() => navigate('/dashboard/investments')}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Back to Investments
      </button>
    </div>
  );
};

export default WithdrawPage;
