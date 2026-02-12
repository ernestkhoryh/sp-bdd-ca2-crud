import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/user/login');
  };

  return (
    <header style={{ backgroundColor: '#2c3e50', color: 'white', padding: '1rem 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Travel Admin
        </Link>
        
        <nav>
          {user ? (
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <Link to="/user" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
              <Link to="/listings" style={{ color: 'white', textDecoration: 'none' }}>Listings</Link>
              <Link to="/itineraries" style={{ color: 'white', textDecoration: 'none' }}>Itineraries</Link>
              <button 
                onClick={handleLogout}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'white', 
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Logout ({user.username || user.email})
              </button>
            </div>
          ) : (
            <Link to="/user/login" style={{ color: 'white', textDecoration: 'none' }}>
              Admin Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
