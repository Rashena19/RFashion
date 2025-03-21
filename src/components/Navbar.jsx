import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          R's Fashion
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          
          <Link to="/about" className="nav-link">
            About
          </Link>
          
          {user ? (
            <>
              <Link to="/create" className="nav-link">
                Create Post
              </Link>
              <div className="user-menu" ref={menuRef}>
                <div 
                  className="user-avatar"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  R
                </div>
                <div className={`dropdown-menu ${isMenuOpen ? 'show' : ''}`}>
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button 
                    className="dropdown-item"
                    onClick={handleLogout}
                    style={{ 
                      width: '100%', 
                      textAlign: 'left', 
                      background: 'none', 
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-button nav-button-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 