import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminReferralBonuses = () => {
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchBonuses = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/referral-bonuses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBonuses(res.data);
      } catch (error) {
        console.error('Failed to fetch referral bonuses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBonuses();
  }, [token]);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">Referral Bonuses</h2>

      {loading ? (
        <p>Loading bonuses...</p>
      ) : bonuses.length === 0 ? (
        <p>No referral bonuses found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded shadow">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Beneficiary</th>
                <th className="px-4 py-2 text-left">From Referral</th>
                <th className="px-4 py-2 text-left">Level</th>
                <th className="px-4 py-2 text-left">Plan (₦)</th>
                <th className="px-4 py-2 text-left">Bonus (₦)</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {bonuses.map((b) => (
                <tr key={b._id} className="border-t border-gray-700">
                  <td className="px-4 py-2">
                    {b.beneficiaryName} ({b.beneficiaryEmail})
                  </td>
                  <td className="px-4 py-2">
                    {b.referredUserName} ({b.referredUserEmail})
                  </td>
                  <td className="px-4 py-2 capitalize">{b.level}</td>
                  <td className="px-4 py-2">
                    ₦{b.planAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-green-400">
                    ₦{b.bonusAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(b.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReferralBonuses;
