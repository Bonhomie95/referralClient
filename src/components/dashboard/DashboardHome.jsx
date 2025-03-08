import { useState, useEffect } from 'react';
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

  return (
    <div className="flex flex-col bg-gray-800 text-white h-full p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            You have {activeInvestments} active investment
            {activeInvestments !== 1 ? 's' : ''} out of {totalInvestments}{' '}
            total.
          </h1>
        </div>
        <NotificationBell />
      </header>
      <div className="mb-8">
        <DashboardChart data={chartData} />
      </div>
      <main className="flex-1">
        <DashboardPlans onPlanSelect={onPlanSelect} />
      </main>
    </div>
  );
};

DashboardHome.propTypes = {
  onPlanSelect: PropTypes.func.isRequired,
};

export default DashboardHome;
