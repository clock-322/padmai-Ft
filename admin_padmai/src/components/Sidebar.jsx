import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">Admin Panel</h2>
      </div>
      <nav className="sidebar-nav">
        <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`}>
          <span className="nav-icon">📊</span>
          <span className="nav-text">Dashboard</span>
        </Link>
        <Link to="/payment" className={`nav-item ${isActive('/payment')}`}>
          <span className="nav-icon">💳</span>
          <span className="nav-text">Payment</span>
        </Link>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-logout-btn">
          <span className="nav-icon">🚪</span>
          <span className="nav-text">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

