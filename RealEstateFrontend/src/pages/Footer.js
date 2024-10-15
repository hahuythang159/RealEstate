import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>About us</h4>
          <ul>
            <li><a href="/about">Our Story</a></li>
            <li><a href="/team">Team</a></li>
            <li><a href="/careers">Careers</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="/help">Help Center</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-social-icons">
        <a href="https://www.facebook.com" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
        <a href="https://www.twitter.com" target="_blank" rel="noreferrer"><i className="fab fa-twitter"></i></a>
        <a href="https://www.instagram.com" target="_blank" rel="noreferrer"><i className="fab fa-instagram"></i></a>
      </div>

      <div className="footer-bottom">
        © 2024 RoomStay. All rights reserved.
      </div>
    </footer>
  );
};


export default Footer;
