import React from 'react';
import '../styles/SocialLinks.css';

const SocialLinks = () => {
  return (
    <aside className="_social-links">
      <ul className="_links-list">
        <li className="_social-link">
          <a
            href="https://www.facebook.com/uess5fine/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
        </li>
        <li className="_social-link">
          <a
            href="https://github.com/hahuythang159"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-github"></i>
          </a>
        </li>
        <li className="_social-link">
          <a
            href="https://www.linkedin.com/in/thangfrontend/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
        </li>
        <li className="_social-link">
          <a
            href="https://www.instagram.com/h_thang_h/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-instagram"></i>
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default SocialLinks;
