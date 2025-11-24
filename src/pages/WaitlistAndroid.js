import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function WaitlistAndroid() {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the email to your backend for Android waitlist
    console.log('Android waitlist email submitted:', email);
    alert('Thank you! We\'ll notify you when Keeep is available on Android.');
    setEmail('');
  };

  return (
    <div className="landing-page">
      {/* Animated gradient background */}

      {/* Background SVG as a positioned element */}
      <div className="background-container">
        {/* SVG for desktop */}
        <img
          src={process.env.PUBLIC_URL + '/images/twirlWhite.svg'}
          alt="Background"
          className="background-svg desktop-bg"
        />
        {/* Also using SVG for mobile to maintain color consistency */}
        <img
          src={process.env.PUBLIC_URL + '/images/twirlWhite.svg'}
          alt="Background"
          className="background-svg mobile-bg"
        />
      </div>

      <div className="content">
        {/* Initial viewport - what's visible on first load */}
        <div className="initial-viewport">
          <div className="logo-container">
            <div className="logo-wrapper">
              <Link to="/">
                <img
                  src={process.env.PUBLIC_URL + '/images/LogoWhite.svg'}
                  alt="Logo"
                  className="logo"
                />
              </Link>
              <span className="beta-label">beta</span>
            </div>
          </div>

          <h2 className="subtitle overline-semibold">Sorry, we only have an iOS app right now</h2>

          <p className="subtitle-text body-one-regular">
            Working hard to bring Keeep to Android. We'll keep you posted:
          </p>

          <form onSubmit={handleSubmit} className="signup-form">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              required
              className="email-input body-one-regular"
            />
            <button type="submit" className="signup-button body-one-semibold">
              Join Android waitlist
            </button>
          </form>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-links">
          <Link to="/terms-of-service" className="footer-link body-two-regular">Terms and Conditions</Link>
          <span className="separator">|</span>
          <Link to="/privacy-policy" className="footer-link body-two-regular">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}

export default WaitlistAndroid;
