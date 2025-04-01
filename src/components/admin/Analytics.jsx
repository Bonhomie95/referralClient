import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setStats(res.data))
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-white text-center">Loading...</p>;
  if (!stats) return null;

  const chartData = [
    { name: 'Users', value: stats.totalUsers },
    { name: 'Investments', value: stats.totalInvestments },
    { name: 'Withdrawals', value: stats.totalWithdrawals },
    { name: 'Referral Bonuses', value: stats.totalReferralBonuses || 0 },

  ];

  const barData = [
    { label: 'Paid', value: stats.totalPaidOut || 0 },
    { label: 'Pending', value: stats.pendingWithdrawals || 0 },
    { label: 'Total Investments', value: stats.totalInvestments || 0 },
  ];

  const colors = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded shadow">
          <p className="text-sm text-gray-400">Total Users</p>
          <h2 className="text-xl font-bold">{stats.totalUsers}</h2>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow">
          <p className="text-sm text-gray-400">Total Investments</p>
          <h2 className="text-xl font-bold">{stats.totalInvestments}</h2>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow">
          <p className="text-sm text-gray-400">Total Withdrawals</p>
          <h2 className="text-xl font-bold">₦{stats.totalWithdrawals}</h2>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow">
          <p className="text-sm text-gray-400">Pending Withdrawals</p>
          <h2 className="text-xl font-bold">{stats.pendingWithdrawals}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Withdrawals Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Platform Summary</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;