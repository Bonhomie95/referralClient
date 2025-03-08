import PropTypes from 'prop-types';
import { investmentPlans } from '../../constants/investmentPlans';

const DashboardPlans = ({ onPlanSelect }) => {
  return (
    <section className="py-10 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Our Plans</h2>
        <p className="text-center text-xl mb-8">
          Choose a plan and start your investment.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {investmentPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-center mb-4 py-2 whitespace-nowrap">
                  {plan.name}
                </h3>
                <p className="text-center text-lg text-gray-300 mb-12">
                  Amount: ₦{plan.price}
                </p>
              </div>
              <button
                onClick={() => onPlanSelect(plan)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                Start
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

DashboardPlans.propTypes = {
  onPlanSelect: PropTypes.func.isRequired,
};

export default DashboardPlans;
