import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { investmentPlans } from '../constants/investmentPlans';
import { FaArrowLeft, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

// Desktop slider: shows 3 cards at a time
const DesktopInvestmentPlans = ({ onStartInvesting }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCards = 3;
  const total = investmentPlans.length;
  const maxIndex = total - visibleCards;

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));

  return (
    <div className="relative">
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full z-10"
      >
        <FaArrowLeft size={20} />
      </button>
      <div className="overflow-hidden mx-auto max-w-[1024px]">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 340}px)` }}
        >
          {investmentPlans.map((plan) => (
            <div
              key={plan.id}
              className="flex-shrink-0 w-[320px] bg-gray-800 rounded-lg shadow-lg p-6 m-4 min-h-[500px]"
            >
              <h3 className="text-2xl font-bold text-center mb-4">
                {plan.name}
              </h3>
              <ul className="mb-4 space-y-2">
                {plan.details.map((detail, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <FaCheckCircle className="text-blue-500 mr-2" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
              <p className="mb-6 text-sm text-gray-300">{plan.description}</p>
              <button
                onClick={onStartInvesting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                Start Investing
              </button>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full z-10"
      >
        <FaArrowRight size={20} />
      </button>
    </div>
  );
};

DesktopInvestmentPlans.propTypes = {
  onStartInvesting: PropTypes.func.isRequired,
};

// Mobile slider: Swipe-enabled
const MobileInvestmentPlans = ({ onStartInvesting }) => {
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const startDrag = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const dragMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDrag = () => setIsDragging(false);

  return (
    <div className="relative md:hidden">
      <button
        onClick={() =>
          sliderRef.current.scrollBy({ left: -320, behavior: 'smooth' })
        }
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full z-10"
      >
        <FaArrowLeft size={20} />
      </button>
      <div
        ref={sliderRef}
        onTouchStart={startDrag}
        onTouchMove={dragMove}
        onTouchEnd={stopDrag}
        className="overflow-x-scroll flex snap-x snap-mandatory gap-4 scroll-smooth px-4"
      >
        {investmentPlans.map((plan) => (
          <div
            key={plan.id}
            className="flex-shrink-0 w-[320px] bg-gray-800 rounded-lg shadow-lg p-6 min-h-[500px] snap-center"
          >
            <h3 className="text-2xl font-bold text-center mb-4">{plan.name}</h3>
            <ul className="mb-4 space-y-2">
              {plan.details.map((detail, index) => (
                <li key={index} className="flex items-center text-sm">
                  <FaCheckCircle className="text-blue-500 mr-2" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
            <p className="mb-6 text-sm text-gray-300">{plan.description}</p>
            <button
              onClick={onStartInvesting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              Start Investing
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() =>
          sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' })
        }
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full z-10"
      >
        <FaArrowRight size={20} />
      </button>
    </div>
  );
};

MobileInvestmentPlans.propTypes = {
  onStartInvesting: PropTypes.func.isRequired,
};

const InvestmentPlans = ({ onStartInvesting }) => {
  return (
    <section id="plans" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Our Plans</h2>
        <p className="text-center text-xl mb-8">
          Discover our range of outstanding plans designed to fit your financial
          goals.
        </p>
        <div className="hidden md:block">
          <DesktopInvestmentPlans onStartInvesting={onStartInvesting} />
        </div>
        <div className="block md:hidden">
          <MobileInvestmentPlans onStartInvesting={onStartInvesting} />
        </div>
      </div>
    </section>
  );
};

InvestmentPlans.propTypes = {
  onStartInvesting: PropTypes.func.isRequired,
};

export default InvestmentPlans;
