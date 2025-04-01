import { Bar } from 'react-chartjs-2';
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import PropTypes from 'prop-types';

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const DashboardChart = ({ data }) => {
  const chartData = {
    labels: [
      'Interest',
      'Commission',
      'Direct Referrals',
      'Indirect Referrals',
    ],
    datasets: [
      {
        label: 'Accrued',
        data: [
          data.interestAccrued,
          data.commissionAccrued,
          data.totalDirectReferrals || 0,
          data.totalIndirectReferrals || 0,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
      },
      {
        label: 'Withdrawn',
        data: [
          data.interestWithdrawn,
          data.commissionWithdrawn,
          0, // Withdrawn doesn't apply to referrals
          0,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(200, 200, 200, 0.3)',
          'rgba(200, 200, 200, 0.3)',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Investment & Referral Performance',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

DashboardChart.propTypes = {
  data: PropTypes.object.isRequired, // Fixed this from `func` to `object`
};

export default DashboardChart;
