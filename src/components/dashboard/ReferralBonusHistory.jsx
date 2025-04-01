import { useEffect, useState } from 'react';
import axios from 'axios';

const ReferralBonusHistory = () => {
  const [bonuses, setBonuses] = useState([]);
  const [filters, setFilters] = useState({
    level: '',
    startDate: '',
    endDate: '',
  });

  const token = localStorage.getItem('token');

  const fetchBonuses = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.level) params.append('level', filters.level);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/referral-bonuses/my-history?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBonuses(res.data);
    } catch (err) {
      console.error('Error fetching bonus history:', err);
    }
  };

  useEffect(() => {
    fetchBonuses();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 bg-gray-800 text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Referral Bonus History</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          name="level"
          value={filters.level}
          onChange={handleFilterChange}
          className="p-2 rounded bg-gray-700"
        >
          <option value="">All Levels</option>
          <option value="1">Level 1</option>
          <option value="2">Level 2</option>
        </select>

        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="p-2 rounded bg-gray-700"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="p-2 rounded bg-gray-700"
        />
        <button
          onClick={fetchBonuses}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Apply Filters
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-gray-700 rounded">
          <thead>
            <tr className="bg-gray-600">
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Bonus Amount</th>
              <th className="py-2 px-4">Plan Amount</th>
              <th className="py-2 px-4">Level</th>
            </tr>
          </thead>
          <tbody>
            {bonuses.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4">
                  No bonuses found.
                </td>
              </tr>
            ) : (
              bonuses.map((bonus) => (
                <tr key={bonus._id} className="text-center border-t">
                  <td className="py-2 px-4">
                    {new Date(bonus.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">₦{bonus.bonusAmount}</td>
                  <td className="py-2 px-4">₦{bonus.planAmount}</td>
                  <td className="py-2 px-4">{bonus.level}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReferralBonusHistory;
