import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import PropTypes from 'prop-types';

const DashboardLayout = ({ onLogout }) => {
  return (
    <div className="flex h-full w-full bg-gray-800">
      <UserSidebar onLogout={onLogout} />
      <div className="flex-1 bg-gray-800">
        <Outlet />
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default DashboardLayout;
