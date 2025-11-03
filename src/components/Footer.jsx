import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-warning">
      <div className="container">

        {/* Bottom bar */}
        <div className="row mt-4 pt-3 border-top">
          <div className="col-md-6 text-start">
            <p className="mb-0">© 2024 Sneaker Hub, all rights reserved.</p>
          </div>
          <div className="col-md-6 text-end social-icons">
            <a href="https://facebook.com" className="text-white me-3"><i className="fab fa-facebook-f"></i></a>
            <a href="https://twitter.com" className="text-white me-3"><i className="fab fa-twitter"></i></a>
            <a href="https://instagram.com" className="text-white"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
