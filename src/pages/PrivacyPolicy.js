import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function PrivacyPolicy() {
  return (
    <div className="landing-page">
      <div className="content policy-content">
        <div className="logo-container">
          <Link to="/">
            <div className="logo-wrapper">
              <img 
                src={process.env.PUBLIC_URL + '/images/LogoWhite.svg'} 
                alt="Logo" 
                className="logo" 
              />
            </div>
          </Link>
        </div>
        
        <h1 className="policy-title">Privacy Policy</h1>
        
        <div className="policy-container">
          <p className="last-updated">Effective Date: January 1, 2024</p>
          
          <section className="policy-section">
            <h2>Introduction</h2>
            <p>
              Welcome to Keeep, a group chat app where you can connect with friends and family to keep each other accountable. 
              We at Keeep value privacy and are committed to keeping your conversation between you and the people in your group. 
              This Privacy Policy outlines how we collect, use, and disclose your any personal information that we do use when you use Keeep.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>Information We Collect</h2>
            <p><strong>Social Login Information:</strong> When you create a Keeep account using a social login provider, we collect the following information from that provider to create your account, based on your privacy settings with them:</p>
            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Profile picture</li>
            </ul>
            <p><strong>Public information:</strong> Other profile information made available through said social login providers (phone number, if your phone number is verified, age, etc) might be collected in the future to improve your experience and to protect your account.</p>
            
            <p><strong>Device Information:</strong> We may collect information about the device you use to access Keeep, such as your IP address, operating system, browser information, and device settings.</p>
            
            <p><strong>Usage Information:</strong> We collect information about how you use Keeep and use it to improve the product. We do not collect the messages sent in your group chats. The messages in your conversations are encrypted and are not accessible to any employee in our organization.</p>
            
            <p><strong>Image Information:</strong> When you share images on Keeep, we store the image files and metadata associated with them, such as the date and time the image was taken, the device it was taken on, and location data (if available).</p>
          </section>
          
          <section className="policy-section">
            <h2>General Use of Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide and operate Keeep services.</li>
              <li>Personalize your Keeep experience with relevant content and recommendations.</li>
              <li>Send you important notifications and updates about Keeep.</li>
              <li>Detect and prevent fraud, abuse, and other illegal activities.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>
          
          <section className="policy-section">
            <h2>Use of Information for Messaging Services</h2>
            <p>We use the information we collect in connection with your use of Keeep's messaging services to:</p>
            <ul>
              <li>Provide you with the Keeep chat related funtionalities.</li>
              <li>Improve Keeep, for example, by increasing the functionality of the service by analyzing usage data to identify technical and design improvements and by evaluating feedback you provide about Keeep.</li>
              <li>Protect you and other Keeep users, for example, by enforcing our Terms of Service, Acceptable Use Policy, and Community Guidelines.</li>
            </ul>
          </section>
          
          <section className="policy-section">
            <h2>End-to-End Encryption</h2>
            <p>
              Keeep employs end-to-end encryption to safeguard your messages and calls. This means that your conversations are encrypted from the moment they leave your device until they reach the recipient's device. Only you and the recipient have the keys to decrypt them, ensuring that no one else, including Keeep, can access your private conversations.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>Your Choices and Controls</h2>
            <p>Through our privacy contact address <a href="mailto:privacy@getkeeep.com">privacy@getkeeep.com</a> You have the following choices and controls over your information:</p>
            <ul>
              <li>Access and update your account information at any time.</li>
              <li>Manage your notification preferences.</li>
              <li>Delete your account and information at any time.</li>
            </ul>
          </section>
          
          <section className="policy-section">
            <h2>Data Sharing and Disclosure</h2>
            <p>We may share your information with:</p>
            <ul>
              <li>Third-party service providers who help us operate and improve Keeep. These third-party service providers are contractually obligated to keep your information confidential and secure.</li>
              <li>Law enforcement or other government agencies if required by law or to comply with a legal process.</li>
              <li>A third-party service provider that specializes in messaging services and keeping them secure.</li>
            </ul>
          </section>
          
          <section className="policy-section">
            <h2>Security Measures</h2>
            <p>
              We implement reasonable security measures to protect your information from unauthorized access, disclosure, alteration, or destruction. However, no security measures are perfect, and we cannot guarantee the absolute security of your information.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>International Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own, where data protection laws may differ.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>Cookies and Tracking Technologies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience. Cookies are small text files stored on your device that help us understand how you use our site.
            </p>
            <p><strong>Types of Cookies We Use:</strong></p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for the website to function properly, including storing your cookie consent preferences.</li>
              <li><strong>Analytics Cookies (if accepted):</strong> Help us understand how visitors interact with our website to improve user experience.</li>
            </ul>
            <p>
              You can manage your cookie preferences through the cookie consent banner that appears when you first visit our website. You can withdraw your consent at any time by clearing your browser cookies or contacting us at <a href="mailto:privacy@getkeeep.com">privacy@getkeeep.com</a>.
            </p>
          </section>

          <section className="policy-section">
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any significant changes.
            </p>
          </section>
        </div>
        
        <div className="back-to-home">
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
      
      <footer className="footer">
        <div className="footer-links">
          <Link to="/terms-of-service" className="footer-link">Terms and Conditions</Link>
          <span className="separator">|</span>
          <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}

export default PrivacyPolicy; 