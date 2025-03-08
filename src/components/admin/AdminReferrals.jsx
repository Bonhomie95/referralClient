import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/referrals`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setReferrals(res.data.referrals))
      .catch((err) => console.error('Error fetching referrals:', err));
  }, [token]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Referrals Management</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Referrer</th>
            <th className="py-2 px-4 border">Direct Referrals</th>
            <th className="py-2 px-4 border">Paid Invitees</th>
            <th className="py-2 px-4 border">Commission Earned</th>
          </tr>
        </thead>
        <tbody>
          {referrals.map((ref) => (
            <tr key={ref._id} className="text-center">
              <td className="py-2 px-4 border">{ref.fullname}</td>
              <td className="py-2 px-4 border">{ref.directCount}</td>
              <td className="py-2 px-4 border">{ref.paidCount}</td>
              <td className="py-2 px-4 border">{ref.commission}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReferrals;
