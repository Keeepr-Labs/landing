import React, { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log('Email submitted:', email);
    alert('Thank you for joining our waitlist!');
    setEmail('');
  };

  return (
    <div className="landing-page">
      {/* Background images for different devices */}
      <div className="background-container">
        {/* SVG for desktop */}
        <img 
          src={process.env.PUBLIC_URL + '/images/twirlWhite.svg'} 
          alt="Background" 
          className="background-svg desktop-bg" 
          style={{ left: '-15%', width: '100%' }}
        />
        {/* Also using SVG for mobile to maintain color consistency */}
        <img 
          src={process.env.PUBLIC_URL + '/images/twirlWhite.svg'} 
          alt="Background" 
          className="background-svg mobile-bg" 
        />
      </div>
      
      <div className="content">
        <div className="logo-container">
          <img 
            src={process.env.PUBLIC_URL + '/images/LogoWhite.svg'} 
            alt="Logo" 
            className="logo" 
            style={{ 
              width: '90vw', 
              maxWidth: '1000px', 
              minWidth: 'auto' 
            }}
          />
        </div>
        
        <h2 className="subtitle">Stick to your workouts, always.</h2>
        
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            required
            className="email-input"
          />
          <button type="submit" className="signup-button">
            Sign up to the waitlist
          </button>
        </form>
      </div>
      
      <footer className="footer">
        <div className="footer-links">
          <a href="/terms" className="footer-link">Terms and Conditions</a>
          <span className="separator">|</span>
          <a href="/privacy" className="footer-link">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
