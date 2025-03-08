import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const AdminReports = () => {
  const [reportData, setReportData] = useState(null);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setReportData(res.data);
      })
      .catch((err) => console.error("Error fetching admin reports:", err));
  }, [token]);

  // Show loading state until reportData is fetched
  if (!reportData) {
    return <p>Loading reports...</p>;
  }

  const chartData = {
    labels: ['Total Users', 'Total Investments', 'Total Commission', 'Total Interest'],
    datasets: [
      {
        label: 'Counts/Amounts',
        data: [
          reportData.totalUsers,
          reportData.totalInvestments,
          reportData.totalCommission,
          reportData.totalInterest
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Platform Overview' },
    },
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Reports</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default AdminReports;
