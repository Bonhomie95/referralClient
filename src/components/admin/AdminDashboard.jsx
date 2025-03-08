import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar onLogout={handleLogout} />
      <div className="flex-1 p-6 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          {/* Additional header items can be added here */}
        </header>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
