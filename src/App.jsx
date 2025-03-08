import { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';
import RegistrationModal from './components/RegistrationModal';
import VerificationModal from './components/VerificationModal';
import LoginModal from './components/LoginModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import DashboardHome from './components/dashboard/DashboardHome';
import Profile from './components/dashboard/Profile';
import Settings from './components/dashboard/Settings';
import Investments from './components/dashboard/Investments';
import PaymentPage from './components/dashboard/PaymentPage';
import WithdrawPage from './components/dashboard/WithdrawPage';
import ReferralReport from './components/dashboard/ReferralReport';
import ChangePassword from './components/ChangePassword';
import DashboardLayout from './components/dashboard/DashboardLayout';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsers from './components/admin/AdminUsers';
import AdminInvestments from './components/admin/AdminInvestments';
import AdminReferrals from './components/admin/AdminReferrals';
import AdminReports from './components/admin/AdminReports';
import ConfirmationModal from './components/ConfirmationModal';

function AppWrapper() {
  const [modal, setModal] = useState(null); // possible values: 'register', 'verify', 'login', 'forgot', 'confirmPlan'
  const [registeredEmail, setRegisteredEmail] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem('token')
  );
  const navigate = useNavigate();
  const location = useLocation();

  // Close modal and clear selected plan
  const closeModal = () => {
    setModal(null);
    setSelectedPlan(null);
  };

  const openModal = (modalName) => {
    if (modalName === 'login' && isLoggedIn) {
      navigate('/dashboard/home');
      return;
    }
    setModal(modalName);
  };

  const handleRegistered = (email) => {
    setRegisteredEmail(email);
    setModal('verify');
  };

  const handleVerified = () => {
    setModal('login');
  };

  const handleLoginSuccess = (token) => {
    setModal(null);
    setIsLoggedIn(true);
    localStorage.setItem('token', token);
    // Optionally store other user details if needed, e.g., email
    setTimeout(() => {
      navigate('/dashboard/home');
    }, 1500);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    navigate('/');
  };

  // When a plan is selected, open confirmation modal
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setModal('confirmPlan');
  };

  const confirmPlan = async () => {
    if (selectedPlan) {
      closeModal();
      navigate('/dashboard/payment', { state: { plan: selectedPlan } });
    }
  };

  const cancelPlan = () => {
    closeModal();
  };

  // Auto logout after 1 hour
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.removeItem('token');
      alert('Session expired. Please log in again.');
      navigate('/');
    }, 3600000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="App">
      <Routes>
        {/* Landing Page (public) */}
        <Route path="/" element={<LandingPage openModal={openModal} />} />

        {/* User Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <DashboardLayout onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        >
          <Route
            path="home"
            element={<DashboardHome onPlanSelect={handlePlanSelect} />}
          />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="investments" element={<Investments />} />
          <Route path="payment" element={<PaymentPage />} />
          <Route path="withdraw" element={<WithdrawPage />} />
          <Route path="referrals" element={<ReferralReport />} />
        </Route>

        <Route path="/changepassword" element={<ChangePassword />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            localStorage.getItem('adminToken') ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        >
          <Route path="users" element={<AdminUsers />} />
          <Route path="investments" element={<AdminInvestments />} />
          <Route path="referrals" element={<AdminReferrals />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {!location.pathname.startsWith('/dashboard') &&
        !location.pathname.startsWith('/admin') && <Footer />}

      {/* Modals for User Authentication */}
      {modal === 'register' && (
        <RegistrationModal
          onClose={closeModal}
          openLogin={() => openModal('login')}
          onRegistered={handleRegistered}
        />
      )}
      {modal === 'verify' && registeredEmail && (
        <VerificationModal
          onClose={closeModal}
          onVerified={handleVerified}
          email={registeredEmail}
        />
      )}
      {modal === 'login' && (
        <LoginModal
          onClose={closeModal}
          onLoginSuccess={handleLoginSuccess}
          openRegister={() => openModal('register')}
          openForgot={() => openModal('forgot')}
        />
      )}
      {modal === 'forgot' && (
        <ForgotPasswordModal
          onClose={closeModal}
          openLogin={() => openModal('login')}
        />
      )}
      {modal === 'confirmPlan' && selectedPlan && (
        <ConfirmationModal
          isOpen={modal === 'confirmPlan'}
          message="Are you sure you want to start this investment?"
          onConfirm={confirmPlan}
          onCancel={cancelPlan}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
