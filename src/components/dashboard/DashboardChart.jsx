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
    labels: ['Interest', 'Commission'],
    datasets: [
      {
        label: 'Accrued',
        data: [data.interestAccrued, data.commissionAccrued],
        backgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)'],
      },
      {
        label: 'Withdrawn',
        data: [data.interestWithdrawn, data.commissionWithdrawn],
        backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)'],
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
        text: 'Investment Performance',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

DashboardChart.propTypes = {
  data: PropTypes.func.isRequired,
};

export default DashboardChart;
