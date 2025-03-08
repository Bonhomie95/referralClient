const Footer = () => {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="bg-gray-900 text-gray-300 py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm">&copy; {currentYear} Referral Investment Platform. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-gray-200 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-200 text-sm">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  