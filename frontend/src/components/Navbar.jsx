import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          💰 Expense Manager
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              
              <Link 
                to="/expenses/new" 
                className={`nav-link ${isActive('/expenses/new') ? 'active' : ''}`}
              >
                New Expense
              </Link>

              {user?.role === 'manager' && (
                <Link 
                  to="/approvals" 
                  className={`nav-link ${isActive('/approvals') ? 'active' : ''}`}
                >
                  Approvals
                </Link>
              )}

              <div className="nav-user">
                <span className="user-name">{user?.name}</span>
                <button onClick={handleLogout} className="btn btn-danger btn-sm">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className={`nav-link ${isActive('/register') ? 'active' : ''}`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
