import PropTypes from 'prop-types';
import HeroSlideshow from './HeroSlideshow';
import Navbar from './Navbar';
import AboutUs from './AboutUs';
import Reviews from './Reviews';
import InvestmentPlans from './InvestmentPlans';
import ContactUs from './ContactUs';
import { useNavigate } from 'react-router-dom';

function LandingPage({ openModal }) {
  const navigate = useNavigate();

  // Handler for "Start Investing" button click
  const handleStartInvesting = () => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard/home'); // or your desired dashboard route
    } else {
      openModal('login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar openModal={openModal} />
      {/* Hero Section with Slideshow */}
      <HeroSlideshow />
      {/* Other sections below */}
      <AboutUs />
      <InvestmentPlans onStartInvesting={handleStartInvesting} />
      <Reviews />
      <ContactUs />
    </div>
  );
}

LandingPage.propTypes = {
  openModal: PropTypes.func.isRequired,
};

export default LandingPage;
