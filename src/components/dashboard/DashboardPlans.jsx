import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { investmentPlans } from '../../constants/investmentPlans';
import { motion } from 'framer-motion';

const DashboardPlans = ({ onPlanSelect }) => {
  const [allowedPlans, setAllowedPlans] = useState([]);
  const location = useLocation();
  const referralLink = new URLSearchParams(location.search).get('ref');

  useEffect(() => {
    const fetchAllowedPlans = async () => {
      try {
        if (referralLink) {
          const res = await axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/api/investments/referral-plan/${referralLink}`
          );
          setAllowedPlans(res.data.allowedPlans);
        } else {
          setAllowedPlans([5000, 10000, 20000, 50000, 100000]);
        }
      } catch (error) {
        console.error('Failed to fetch referral plan:', error.message);
        setAllowedPlans([5000, 10000, 20000, 50000, 100000]);
      }
    };

    fetchAllowedPlans();
  }, [referralLink]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {investmentPlans
        .filter((plan) => allowedPlans.includes(plan.price))
        .map((plan, index) => (
          <motion.div
            key={plan.id}
            className="bg-gray-900 text-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <h3 className="text-2xl font-semibold mb-2 text-center">
              {plan.name}
            </h3>
            <p className="text-xl font-bold mb-6">
              ₦{plan.price.toLocaleString()}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg text-white font-semibold"
              onClick={() => onPlanSelect(plan)}
            >
              Start Plan
            </motion.button>
          </motion.div>
        
        ))}
    </div>
  );
};

DashboardPlans.propTypes = {
  onPlanSelect: PropTypes.func.isRequired,
};

export default DashboardPlans;
