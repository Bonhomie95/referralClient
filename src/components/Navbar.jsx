import { useState } from 'react';
import PropTypes from 'prop-types';

function Navbar({ openModal }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleNavLinkClick = (e, target) => {
    // Close mobile nav if open
    if (isMobileNavOpen) setIsMobileNavOpen(false);
    // Scroll to the target section
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-bold">InvestmentPlatform</div>
        <div className="hidden md:flex space-x-6">
          <button onClick={(e) => handleNavLinkClick(e, 'home')}>Home</button>
          <button onClick={(e) => handleNavLinkClick(e, 'about')}>About Us</button>
          <button onClick={(e) => handleNavLinkClick(e, 'plans')}>Plans</button>
          <button onClick={(e) => handleNavLinkClick(e, 'reviews')}>Reviews</button>
          <button onClick={(e) => handleNavLinkClick(e, 'contact')}>Contact Us</button>
          <button onClick={() => openModal('login')} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
            Login
          </button>
        </div>
        <div className="md:hidden">
          {isMobileNavOpen ? (
            <button onClick={() => setIsMobileNavOpen(false)} className="text-white">
              {/* Close Icon */}
              X
            </button>
          ) : (
            <button onClick={() => setIsMobileNavOpen(true)} className="text-white">
              {/* Hamburger Icon */}
              ☰
            </button>
          )}
        </div>
      </div>
      {isMobileNavOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="flex flex-col space-y-2 px-4 pb-4">
            <button onClick={(e) => handleNavLinkClick(e, 'home')}>Home</button>
            <button onClick={(e) => handleNavLinkClick(e, 'about')}>About Us</button>
            <button onClick={(e) => handleNavLinkClick(e, 'reviews')}>Reviews</button>
            <button onClick={(e) => handleNavLinkClick(e, 'plans')}>Plans</button>
            <button onClick={(e) => handleNavLinkClick(e, 'contact')}>Contact Us</button>
            <button 
              onClick={() => {
                setIsMobileNavOpen(false);
                openModal('login');
              }} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

Navbar.propTypes = {
  openModal: PropTypes.func.isRequired,
};

export default Navbar;
