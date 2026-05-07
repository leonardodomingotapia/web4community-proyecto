import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { usuario, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (location.pathname === '/login' || location.pathname === '/registro') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-logo">
          <span>WEB4COMMUNITY</span>
        </Link>

        <div className="nav-links">
          <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <i className="fas fa-chart-line"></i> Dashboard
          </Link>
          <Link to="/productos" className={`nav-link ${location.pathname === '/productos' ? 'active' : ''}`}>
            <i className="fas fa-box"></i> Productos
          </Link>
        </div>

        <div className="user-info">
          <span className="user-name">
            <i className="fas fa-user-astronaut"></i> {usuario?.nombre}
          </span>
          <button onClick={handleLogout} className="btn-logout">
            <i className="fas fa-sign-out-alt"></i> Salir
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;