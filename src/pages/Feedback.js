import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Feedback() {
  return (
    <div className="feedback-page">
      <div className="feedback-container">
        <div className="logo-container">
          <Link to="/">
            <img
              src={process.env.PUBLIC_URL + '/images/LogoWhite.svg'}
              alt="Keeep Logo"
              className="logo"
            />
          </Link>
        </div>

        <div className="feedback-content">
          <h1 className="feedback-title">We'd love to hear from you</h1>

          <a
            href="https://wdix8ve5sbo.typeform.com/to/Et9rKFEi"
            target="_blank"
            rel="noopener noreferrer"
            className="feedback-button"
          >
            Share Your Feedback
          </a>
        </div>

        <footer className="footer">
          <div className="footer-links">
            <Link to="/terms-of-service" className="footer-link body-two-regular">Terms and Conditions</Link>
            <span className="separator">|</span>
            <Link to="/privacy-policy" className="footer-link body-two-regular">Privacy Policy</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Feedback;
