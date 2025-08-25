import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          InvoiceApp
        </Link>
        <ul className="nav-menu">
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/invoices" className="nav-links">
                  Invoices
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/create-invoice" className="nav-links">
                  Create Invoice
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={onLogout} className="nav-links-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-links">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-links">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;