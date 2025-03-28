import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [filterMode, setFilterMode] = useState('active'); // "active", "inactive", "all"
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  // Fetch investments for the logged in user
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/investments/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setInvestments(res.data.investments);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching investments:', err);
        setLoading(false);
      });
  }, [token]);

  // Filter investments based on filterMode
  const filteredInvestments =
    filterMode === 'all'
      ? investments
      : investments.filter((inv) => inv.isActive === (filterMode === 'active'));

  if (loading) {
    return <p className="text-white p-8">Loading investments...</p>;
  }

  // Detailed view for an investment (remains unchanged)
  if (selectedInvestment) {
    return (
      <div className="max-w-4xl mx-auto p-4 bg-gray-800 text-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Investment Details</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="font-medium">Plan ID</label>
            <input
              type="text"
              value={selectedInvestment.planId ?? 'N/A'}
              readOnly
              className="w-full p-2 bg-gray-700 rounded"
            />
          </div>
          <div>
            <label className="font-medium">Plan Duration (days)</label>
            <input
              type="text"
              value={Math.floor(
                (new Date(selectedInvestment.expiryDate) -
                  new Date(selectedInvestment.planStartDate)) /
                  (1000 * 60 * 60 * 24)
              )}
              readOnly
              className="w-full p-2 bg-gray-700 rounded"
            />
          </div>
          <div>
            <label className="font-medium">Plan Amount (NGN)</label>
            <input
              type="text"
              value={selectedInvestment.planAmount}
              readOnly
              className="w-full p-2 bg-gray-700 rounded"
            />
          </div>
          <div>
            <label className="font-medium">Start Date</label>
            <input
              type="text"
              value={new Date(
                selectedInvestment.planStartDate
              ).toLocaleDateString()}
              readOnly
              className="w-full p-2 bg-gray-700 rounded"
            />
          </div>
          <div>
            <label className="font-medium">Expiry Date</label>
            <input
              type="text"
              value={new Date(
                selectedInvestment.expiryDate
              ).toLocaleDateString()}
              readOnly
              className="w-full p-2 bg-gray-700 rounded"
            />
          </div>
          <div>
            <label className="font-medium">Total Interest Accrued</label>
            <input
              type="text"
              value={selectedInvestment.interestAccrued}
              readOnly
              className="w-full p-2 bg-gray-700 rounded"
            />
          </div>
          <div>
            <label className="font-medium">Total Commission Accrued</label>
            <input
              type="text"
              value={selectedInvestment.commissionAccrued}
              readOnly
              className="w-full p-2 bg-gray-700 rounded"
            />
          </div>
          <div>
            <label className="font-medium">Total Invitees</label>
            <input
              type="text"
              value={selectedInvestment.totalInvited}
              readOnly
              className="w-full p-2 bg-gray-700 rounded"
            />
          </div>
          <div>
            <label className="font-medium">Payment Status</label>
            <input
              type="text"
              value={selectedInvestment.paymentStatus}
              readOnly
              className="w-full p-2 bg-gray-700 rounded"
            />
          </div>
          <div>
            <label className="font-medium">Referral Link</label>
            <input
              type="text"
              readOnly
              value={`${import.meta.env.VITE_APP_URL}/register?ref=${
                selectedInvestment.referralLink
              }`}
              className="w-full p-2 bg-gray-700 rounded"
            />
          </div>
          {(() => {
            const start = new Date(selectedInvestment.planStartDate);
            const today = new Date();
            const daysElapsed = Math.floor(
              (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (daysElapsed >= 8) {
              const remaining = Math.max(
                (selectedInvestment.withdrawalReferralTarget || 0) -
                  (selectedInvestment.referralCount || 0),
                0
              );
              return (
                <div>
                  <label className="font-medium">Invitees Needed</label>
                  <input
                    type="text"
                    readOnly
                    value={`${remaining} more invitee(s) needed to enable commission withdrawal.`}
                    className="w-full p-2 bg-gray-700 rounded"
                  />
                </div>
              );
            }

            return null;
          })()}
        </div>
        <button
          onClick={() => setSelectedInvestment(null)}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Back to Investments
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your Investments</h2>
      <div className="mb-4 flex items-center space-x-4">
        <span className="font-medium">Show:</span>
        <button
          onClick={() => setFilterMode('active')}
          className={`px-4 py-2 rounded ${
            filterMode === 'active' ? 'bg-blue-600' : 'bg-gray-700'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilterMode('inactive')}
          className={`px-4 py-2 rounded ${
            filterMode === 'inactive' ? 'bg-blue-600' : 'bg-gray-700'
          }`}
        >
          Inactive
        </button>
        <button
          onClick={() => setFilterMode('all')}
          className={`px-4 py-2 rounded ${
            filterMode === 'all' ? 'bg-blue-600' : 'bg-gray-700'
          }`}
        >
          Show All
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-gray-700">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Plan Amount (NGN)</th>
              <th className="py-2 px-4 border-b">Start Date</th>
              <th className="py-2 px-4 border-b">Expiry Date</th>
              <th className="py-2 px-4 border-b">Total Interest</th>
              <th className="py-2 px-4 border-b">Total Commission</th>
              <th className="py-2 px-4 border-b">Total Invitees</th>
              <th className="py-2 px-4 border-b">Details</th>
              <th className="py-2 px-4 border-b">Withdraw</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvestments.map((inv) => (
              <tr key={inv._id} className="hover:bg-gray-600">
                <td className="py-2 px-4 border-b">
                  {inv.planAmount.toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(inv.planStartDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(inv.expiryDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {inv.interestAccrued}
                </td>
                <td className="py-2 px-4 border-b">
                  {inv.commissionAccrued}
                </td>
                <td className="py-2 px-4 border-b">{inv.paidInvitees}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => setSelectedInvestment(inv)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    View Details
                  </button>
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() =>
                      navigate('/dashboard/withdraw', {
                        state: { investment: inv },
                      })
                    }
                    className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded"
                  >
                    Withdraw
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="block md:hidden">
        {filteredInvestments.map((inv) => (
          <div key={inv._id} className="bg-gray-700 p-4 rounded mb-4">
            <p>
              <strong>Plan Amount:</strong> {inv.planAmount}
            </p>
            <p>
              <strong>Interest:</strong> {inv.interestAccrued}
            </p>
            <p>
              <strong>Commission:</strong> {inv.commissionAccrued}
            </p>
            <div className="flex justify-between mt-2">
              <button
                onClick={() => setSelectedInvestment(inv)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                View Details
              </button>
              <button
                onClick={() =>
                  navigate('/dashboard/withdraw', {
                    state: { investment: inv },
                  })
                }
                className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded"
              >
                Withdraw
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Investments;
