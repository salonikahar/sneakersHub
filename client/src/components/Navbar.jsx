import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { getCartItemCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Update user info when component mounts
  useEffect(() => {
    const updateUserInfo = () => {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        setIsUserLoggedIn(userData.isLoggedIn);
        setUserName(userData.name || userData.email);
      } else {
        setIsUserLoggedIn(false);
        setUserName('');
      }
    };

    updateUserInfo();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        updateUserInfo();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsUserLoggedIn(false);
    setUserName('');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold" to="/">
          <img src="https://img.icons8.com/ios-filled/50/000000/trainers.png" alt="logo" width="40" />
          SNEAKERSHUB
        </Link>

        {/* Search Bar */}
        <form className="d-none d-md-flex ms-3 me-auto" role="search" onSubmit={handleSearchSubmit}>
          <input
            className="form-control search-box"
            type="search"
            placeholder="search..."
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-light ms-1" type="submit">
            <i className="fa fa-search"></i>
          </button>
        </form>

        {/* Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/">HOME</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/shop">SHOP</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/contact">CONTACT US</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-bold" to="/about">ABOUT</Link>
            </li>

           

            {/* Cart Icon with Badge */}
            <li className="nav-item ms-2">
              <Link to="/cart" className="nav-link position-relative" title="View Cart">
                <i className="fa fa-shopping-bag fa-lg"></i>
                {getCartItemCount() > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {getCartItemCount() > 99 ? '99+' : getCartItemCount()}
                  </span>
                )}
              </Link>
            </li>

            {/* User Profile Section */}
            <li className="nav-item dropdown ms-2">
              <button
                className="btn btn-outline-primary dropdown-toggle d-flex align-items-center"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fa fa-user me-2"></i>
                {isUserLoggedIn ? (
                  <span className="d-none d-md-inline">{userName}</span>
                ) : (
                  <span>Account</span>
                )}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                {isUserLoggedIn ? (
                  <>
                    <li className="dropdown-header">
                      <small className="text-muted">Welcome back!</small>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="fa fa-user me-2"></i>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/orders">
                        <i className="fa fa-shopping-bag me-2"></i>
                        My Orders
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/wishlist">
                        <i className="fa fa-heart me-2"></i>
                        Wishlist
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="fa fa-sign-out me-2"></i>
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="dropdown-header">
                      <small className="text-muted">Welcome to SneakersHub!</small>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/signin">
                        <i className="fa fa-sign-in me-2"></i>
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/signin">
                        <i className="fa fa-user-plus me-2"></i>
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
