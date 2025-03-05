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
      <div className="content">
        <div className="logo-container">
          <img src="/images/logo.png" alt="Logo" className="logo" />
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
