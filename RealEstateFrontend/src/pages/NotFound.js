import React from 'react';
import { FaHome, FaExclamationCircle } from 'react-icons/fa';
import '../styles/NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <FaExclamationCircle className="not-found-icon" />
      <h1 className="not-found-title">404</h1>
      <h2 className="not-found-subtitle">Page Not Found</h2>
      <p className="not-found-message">
        The page you're looking for does not exist or has been moved. Please
        check the URL or go back to the homepage.
      </p>
      <button
        className="not-found-button"
        onClick={() => (window.location.href = '/')}
      >
        <FaHome className="home-icon" />
      </button>
    </div>
  );
};

export default NotFound;
