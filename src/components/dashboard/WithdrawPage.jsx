import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
const WithdrawPage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [withdrawInputs, setWithdrawInputs] = useState({});
  const [inputErrors, setInputErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [pendingWithdrawal, setPendingWithdrawal] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const investment = location.state?.investment;

  const withdrawSchema = z.object({
    interest: z.string().regex(/^\d+$/, 'Interest must be numeric').optional(),
    commission: z
      .string()
      .regex(/^\d+$/, 'Commission must be numeric')
      .optional(),
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!investment) return navigate('/dashboard/investments');

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserProfile(res.data))
      .catch((err) => console.error(err));
  }, [investment, navigate]);

  const handleInputChange = (e, type, max) => {
    const value = e.target.value;
    if (!/^[0-9]*$/.test(value)) return;

    setWithdrawInputs((prev) => ({
      ...prev,
      [type]: value,
    }));

    setInputErrors((prev) => ({
      ...prev,
      [type]: value && Number(value) > max ? 'Amount exceeds balance' : '',
    }));
  };

  const handleWithdraw = async (amount, withdrawalType) => {
    const parsed = withdrawSchema.safeParse(withdrawInputs);
    if (!parsed.success) {
      setNotification(parsed.error.errors[0].message);
      return;
    }

    if (!userProfile) return;
    const { bankName, bankAccountNumber, bankAccountName, bankCode } =
      userProfile;

    const now = new Date();
    const start = new Date(investment.planStartDate);
    const daysElapsed = Math.floor((now - start) / (1000 * 60 * 60 * 24));
    const invitees = investment.paidInvitees || 0;

    if (amount < 2000) {
      setNotification('Minimum withdrawal amount is ₦2000.');
      return;
    }

    if (withdrawalType === 'interest') {
      if (daysElapsed >= 4 && daysElapsed < 14 && invitees < 5) {
        setNotification('You need at least 5 invitees to withdraw interest.');
        return;
      } else if (daysElapsed >= 14 && invitees < 10) {
        setNotification('You need at least 10 invitees to withdraw interest.');
        return;
      }
    } else if (withdrawalType === 'commission') {
      if (invitees < 10) {
        setNotification(
          'You need at least 10 invitees to withdraw commission.'
        );
        return;
      }
    }

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/withdraw`,
        {
          amount,
          withdrawalType,
          bankDetails: {
            bankName,
            bankAccountNumber,
            bankAccountName,
            bankCode,
          },
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      navigate('/withdrawal-status?status=success');
    } catch (err) {
      setNotification(err.response?.data?.message || 'Withdrawal failed');
      navigate('/withdrawal-status?status=failed');
    } finally {
      setLoading(false);
    }
  };

  if (!investment) return null;

  const interestBal = investment.interestAccrued - investment.interestWithdrawn;
  const commissionBal =
    investment.commissionAccrued - investment.commissionWithdrawn;
  const now = new Date();
  const start = new Date(investment.planStartDate);
  const daysElapsed = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const invitees = investment.paidInvitees || 0;

  const neededInvites =
    daysElapsed >= 14 ? 10 - invitees : daysElapsed >= 4 ? 5 - invitees : 0;

  const isInterestDisabled =
    loading ||
    !withdrawInputs.interest ||
    Number(withdrawInputs.interest) > interestBal ||
    Number(withdrawInputs.interest) < 2000 ||
    (daysElapsed >= 4 && daysElapsed < 14 && invitees < 5) ||
    (daysElapsed >= 14 && invitees < 10);

  const isCommissionDisabled =
    loading ||
    !withdrawInputs.commission ||
    Number(withdrawInputs.commission) > commissionBal ||
    Number(withdrawInputs.commission) < 2000 ||
    invitees < 10;

  return (
    <div className="p-6 md:p-8 bg-gray-800 text-white min-h-screen">
      {userProfile && (
        <div className="mb-6 bg-gray-700 p-4 rounded shadow-md">
          <h3 className="text-lg font-semibold mb-2 text-white">
            Withdrawal Account Details
          </h3>
          <p className="text-gray-300">
            <strong>Bank Code:</strong> {userProfile.bankCode || 'N/A'}
          </p>
          <p className="text-gray-300">
            <strong>Bank Name:</strong> {userProfile.bankName}
          </p>
          <p className="text-gray-300">
            <strong>Account Name:</strong> {userProfile.bankAccountName}
          </p>
          <p className="text-gray-300">
            <strong>Account Number:</strong> {userProfile.bankAccountNumber}
          </p>
        </div>
      )}

      <div className="mb-6 p-4 bg-gray-700 rounded shadow-md">
        <div className="mb-4">
          <label className="block mb-1">
            Interest Balance (₦{interestBal}) -{' Minimum withdrawal is ₦2000'}
          </label>
          <input
            type="text"
            placeholder="Enter amount to withdraw"
            className="w-full mb-1 p-2 rounded bg-gray-600 text-white"
            value={withdrawInputs.interest || ''}
            onChange={(e) => handleInputChange(e, 'interest', interestBal)}
          />
          {inputErrors.interest && (
            <p className="text-red-400 mb-1">{inputErrors.interest}</p>
          )}
          <button
            className="bg-green-500 px-4 py-2 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={isInterestDisabled}
            onClick={() =>
              setPendingWithdrawal({
                amount: Number(withdrawInputs.interest),
                type: 'interest',
              }) || setShowModal(true)
            }
          >
            Withdraw Interest
          </button>
          {daysElapsed >= 4 && neededInvites > 0 && (
            <p className="text-yellow-400 mt-2">
              {neededInvites} more invitee(s) needed to enable interest
              withdrawal.
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1">
            Commission Balance (₦{commissionBal}) -
            {' Minimum withdrawal is ₦2000'}
          </label>
          <input
            type="text"
            placeholder="Enter amount to withdraw"
            className="w-full mb-1 p-2 rounded bg-gray-600 text-white"
            value={withdrawInputs.commission || ''}
            onChange={(e) => handleInputChange(e, 'commission', commissionBal)}
          />
          {inputErrors.commission && (
            <p className="text-red-400 mb-1">{inputErrors.commission}</p>
          )}
          <button
            className="bg-blue-500 px-4 py-2 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={isCommissionDisabled}
            onClick={() =>
              setPendingWithdrawal({
                amount: Number(withdrawInputs.commission),
                type: 'commission',
              }) || setShowModal(true)
            }
          >
            Withdraw Commission
          </button>
          {invitees < 10 && (
            <p className="text-yellow-400 mt-2">
              {10 - invitees} more invitee(s) needed to enable commission
              withdrawal.
            </p>
          )}
        </div>
      </div>

      {showModal && pendingWithdrawal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Confirm Withdrawal</h3>
            <p className="mb-4">
              Are you sure you want to withdraw ₦{pendingWithdrawal.amount} from{' '}
              <strong>{pendingWithdrawal.type}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-600 rounded"
                onClick={() => {
                  setShowModal(false);
                  setPendingWithdrawal(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 rounded"
                onClick={() => {
                  handleWithdraw(
                    pendingWithdrawal.amount,
                    pendingWithdrawal.type
                  );
                  setShowModal(false);
                  setPendingWithdrawal(null);
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <p className="mt-4 p-2 bg-gray-600 rounded shadow-md">{notification}</p>
      )}
    </div>
  );
};

export default WithdrawPage;
