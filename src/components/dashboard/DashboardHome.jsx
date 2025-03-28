import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import DashboardPlans from './DashboardPlans';
import axios from 'axios';
import NotificationBell from '../NotificationBell';
import DashboardChart from './DashboardChart';

const DashboardHome = ({ onPlanSelect }) => {
  const [activeInvestments, setActiveInvestments] = useState(0);
  const [totalInvestments, setTotalInvestments] = useState(0);
  const [chartData, setChartData] = useState({
    interestAccrued: 0,
    interestWithdrawn: 0,
    commissionAccrued: 0,
    commissionWithdrawn: 0,
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setActiveInvestments(res.data.activeInvestments);
        setTotalInvestments(res.data.totalInvestments);
        setChartData({
          interestAccrued: res.data.interestAccrued,
          interestWithdrawn: res.data.interestWithdrawn,
          commissionAccrued: res.data.commissionAccrued,
          commissionWithdrawn: res.data.commissionWithdrawn,
        });
      })
      .catch((err) => console.error('Error fetching profile data:', err));
  }, [token]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL);
    const userId = localStorage.getItem('userId');

    socket.emit('join', userId);

    socket.on('withdrawal-status', (data) => {
      if (data.userId === userId) {
        alert(`Withdrawal ${data.status}: ₦${data.amount}`);
      }
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="flex flex-col bg-gray-800 text-white min-h-screen p-4 md:p-8 overflow-hidden">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
        <h1 className="text-lg md:text-2xl font-bold mb-2 md:mb-0">
          {activeInvestments} active investment
          {activeInvestments !== 1 ? 's' : ''} of {totalInvestments} total
        </h1>
        <NotificationBell />
      </header>

      <section className="hidden md:block mb-4 md:mb-6">
        <DashboardChart data={chartData} />
      </section>

      <main className="flex-1 overflow-y-auto pb-4">
        <DashboardPlans onPlanSelect={onPlanSelect} />
      </main>
    </div>
  );
};

DashboardHome.propTypes = {
  onPlanSelect: PropTypes.func.isRequired,
};

export default DashboardHome;
