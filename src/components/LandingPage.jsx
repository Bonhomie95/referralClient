import PropTypes from 'prop-types';
import HeroSlideshow from './HeroSlideshow';
import Navbar from './Navbar';
import AboutUs from './AboutUs';
import Reviews from './Reviews';
import InvestmentPlans from './InvestmentPlans';
import ContactUs from './ContactUs';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';


function LandingPage({ openModal }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryRef = new URLSearchParams(location.search).get('ref');
    if (queryRef) {
      localStorage.setItem('referralUsed', queryRef);
      openModal('register', { referralCode: queryRef }); // ✅ open registration modal
    }
  }, [location.search, openModal]);

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
