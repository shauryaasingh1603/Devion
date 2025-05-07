import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { logoutUser } from '../../store/slices/authSlice';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };
  
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <h1>Kuber</h1>
              <span className="tagline">AI-Powered Risk Protection</span>
            </Link>
          </div>
          
          <button 
            className="mobile-menu-toggle" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}></span>
          </button>
          
          <nav className={`main-nav ${mobileMenuOpen ? 'open' : ''}`}>
            {isAuthenticated ? (
              <>
                <ul className="nav-links">
                  <li className={isActive('/dashboard')}>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li className={isActive('/watchlist')}>
                    <Link to="/watchlist">Watchlist</Link>
                  </li>
                  <li className={isActive('/settings')}>
                    <Link to="/settings">Settings</Link>
                  </li>
                </ul>
                
                <div className="user-menu">
                  <div className="user-info">
                    <span className="user-name">{user?.displayName}</span>
                    <span className="user-email">{user?.email}</span>
                  </div>
                  <button className="logout-button" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <ul className="nav-links">
                <li>
                  <Link to="/login" className="login-button">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="register-button">Register</Link>
                </li>
              </ul>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
