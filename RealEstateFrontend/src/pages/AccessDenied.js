import React from 'react';
import { FaUserLock } from 'react-icons/fa';
import '../styles/AccessDenied.css';

const AccessDenied = () => {
  return (
    <div className="container">
      <FaUserLock className="icon" />
      <h1 className="title-ad">ACCESS DENIED</h1>
      <p className="message">You do not have permission to access this page.</p>
    </div>
  );
};

export default AccessDenied;
