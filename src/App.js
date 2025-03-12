import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Import page components
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';

// Home page component
function Home() {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log('Email submitted:', email);
    alert('Thank you, you are now on the waitlist!');
    setEmail('');
  };

  return (
    <div className="landing-page">
      {/* Animated gradient background - moved to top of component */}
      {/* Gradient is now applied directly to the landing-page element */}
      
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
            <img 
              src={process.env.PUBLIC_URL + '/images/LogoWhite.svg'} 
              alt="Logo" 
              className="logo" 
            />
            <span className="beta-label">beta</span>
          </div>
          
          <h2 className="subtitle overline-semibold">Stick to your workouts, always</h2>
          
          <p className="subtitle-text body-one-regular">
            No AI magic. Just accountability.<br />
            A group chat with friends, with your goals and progress (or lack of) on display, 
            plus a little something on the line and voilá 🍑
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
              Sign up to the waitlist
            </button>
          </form>
        </div>
        
        {/* No need for a spacer anymore */}
      </div>
      
      <footer className="footer">
        <div className="footer-links">
          <Link to="/terms" className="footer-link body-two-regular">Terms and Conditions</Link>
          <span className="separator">|</span>
          <Link to="/privacy" className="footer-link body-two-regular">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}

// Main App component with routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
      </Routes>
    </Router>
  );
}

export default App;
