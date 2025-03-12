import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function TermsAndConditions() {
  return (
    <div className="landing-page">
      <div className="content policy-content">
        <div className="logo-container">
          <Link to="/">
            <img 
              src={process.env.PUBLIC_URL + '/images/LogoWhite.svg'} 
              alt="Logo" 
              className="logo" 
            />
          </Link>
        </div>
        
        <h1 className="policy-title">Terms of Service</h1>
        
        <div className="policy-container">
          <p className="last-updated">Effective Date: January 1, 2024</p>
          
          <section className="policy-section">
            <h2>1. Introduction</h2>
            <p>
              These Terms and Conditions ("Terms") govern your use of Keeep, also known as getKeeep ("App"). By using the App, you agree to be bound by these Terms of Service. You must meet the minimum age requirement to use the App, as defined by the laws of your country.
            </p>
            <p>
              The App is a global platform operating through servers located in various countries, including the United States. If you live in a country with data protection laws, the storage of your personal data may not provide you with the same protections as you enjoy in your country of residence.
            </p>
            <p>
              Our messaging features are powered by Stream, a third-party service provider. By using our chat functionality, you agree to comply with Stream's Terms of Service, Privacy Policy, and any other applicable legal agreements provided by Stream. These documents govern your use of Stream's services and are available for review at <a href="https://getstream.io/legal/" target="_blank" rel="noopener noreferrer">https://getstream.io/legal/</a>. In the event of a conflict between our terms and Stream's terms, Stream's terms shall govern with respect to the messaging functionality.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>2. User Content and Conduct</h2>
            <p>
              You are solely responsible for the content you upload, post, or transmit through the App ("Your Content").
            </p>
            <p>
              Your Content must comply with Stream's Acceptable Use Policy and Terms of Service, which prohibit illegal activity, harmful content, infringement of third-party rights, offensive material, spam, and other inappropriate conduct. The App may use automated abuse detection mechanisms to detect harmful content and reserves the right to screen, monitor, and remove any content that violates these Terms.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>3. Messaging and Communication</h2>
            <p>
              Our messaging features are powered by Stream, a third-party service provider. By using our chat functionality, you agree to comply with Stream's Terms of Service, Privacy Policy, and any other applicable legal agreements provided by Stream. These documents govern your use of Stream's services and are available for review at <a href="https://getstream.io/legal/" target="_blank" rel="noopener noreferrer">https://getstream.io/legal/</a>. In the event of a conflict between our terms and Stream's terms, Stream's terms shall govern with respect to the messaging functionality.
            </p>
            <p>
              We are not responsible for the availability, performance, or functionality of Stream's services, and you acknowledge and agree that Stream is solely responsible for the messaging functionality and any issues related to their platform. We disclaim all liability related to the use of Stream's services, including any failure or interruption of the messaging functionality.
            </p>
            <p>
              The App may provide features to inform contacts about the App or share your information with others. You are responsible for ensuring you have the right to provide any contact information.
            </p>
            <p>
              In accordance with Stream's functionality and policies user message history is stored on the user's device, while limited technical information necessary for message transmission is stored on Stream's servers.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>4. Third-Party Services</h2>
            <p>
              The App may contain links to third-party websites or resources shared by other users in users communications. The App is not responsible for the availability, accuracy, or content of these third-party services. You use them at your own risk.
            </p>
            <p>
              If you use any third-party integrations within the app (e.g., fitness trackers like Strava), you will be subject to the third-party's terms of service.
            </p>
            <p>
              If you choose to make in-app purchases, you agree that additional terms may apply and payments will be processed through third-party payment methods.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>5. In-App Purchases</h2>
            <p>
              This section outlines the terms and conditions that apply when you choose to make purchases within the App ("In-App Purchases"). By making an In-App Purchase, you agree to these terms.
            </p>
            <p>
              <strong>Payment Methods:</strong> The App may offer various payment methods for In-App Purchases, such as credit cards, debit cards, and third-party payment platforms like Google Pay or Apple Pay. The availability of specific payment methods may vary depending on your location and other factors. We use third-party payment processors to handle transactions. You authorize us to charge your chosen payment method for the price of the In-App Purchase. You are responsible for any fees charged by your payment provider related to the transaction, including but not limited to foreign transaction fees.
            </p>
            <p>
              <strong>Refunds:</strong> All In-App Purchases are final and non-refundable, except as required by law or as otherwise stated in these Terms. We may, at our sole discretion, choose to offer refunds for certain In-App Purchases under specific circumstances. However, we are not obligated to provide a refund for any reason. If you believe you are entitled to a refund for an In-App Purchase, please contact our customer support team. We will review your request and make a decision based on our refund policy and applicable laws.
            </p>
            <p>
              <strong>Virtual Items:</strong> The App may offer virtual items for purchase("Virtual Items"). Virtual Items represent a limited, non-transferable license to use the item within the App. You do not own the Virtual Items, and they have no monetary value outside of the App. We may modify or remove Virtual Items at our discretion, and we are not obligated to provide any compensation for unused Virtual Items if the App or your account is terminated. All purchases of Virtual Items are final and non-refundable.
            </p>
            <p>
              <strong>Third-Party Payment Platforms:</strong> If you download the App through a third-party app store (like Apple App Store or Google Play Store), their terms and conditions, including payment policies, may also apply to your In-App Purchases. Please review the third-party platform's terms and conditions before making any In-App Purchases.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>6. Disclaimer of Warranties and Limitation of Liability</h2>
            <p>
              The App and its services are provided "as is" and "as available" without any warranty, express or implied. The App does not guarantee that the services will be uninterrupted, secure, or error-free.
            </p>
            <p>
              The App's liability is limited as outlined in Stream's Terms and Conditions.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>7. Indemnity</h2>
            <p>
              You agree to indemnify the App from any claims arising from your use of the App, Your Content, or violation of these Terms.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>8. Term and Termination</h2>
            <p>
              These Terms commence upon your use of the App and continue until terminated in accordance with these Terms and Stream's Terms of Service.
            </p>
            <p>
              You may terminate your account at any time by deleting the App. To delete your account information please contact the email address provided at the end of this document.
            </p>
            <p>
              The App may suspend or terminate your account for violations of these Terms or other inappropriate conduct, as outlined in Stream's Terms and Conditions. Appeals processes may be available in certain circumstances.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>9. Data Collection Transparency and Data Use Disclosure</h2>
            <p><strong>Data Collection:</strong> The App collects the following types of data for the purposes described below:</p>
            <ul>
              <li>Account Information: Name, email address and any information obtained from the social login provider selected by the user. Any of this information is exclusively accessible according users own set preferences with said provider. This is collected for account creation, authentication and communication.</li>
              <li>Usage Data: App usage, features accessed and interactions with content. This is collected to analyze app performance, improve functionality, and improving the users experience.</li>
              <li>Device Information: The timezone where the device is used and the devices operating system are collected. This is collected for technical diagnostics and for improvement of the users experience where the localized time is relevant in the App use.</li>
            </ul>
            
            <p><strong>Data Use:</strong> The App uses the collected data for the following purposes:</p>
            <ul>
              <li>Providing and improving the App's functionalities.</li>
              <li>Improving user experience.</li>
              <li>Facilitating communication between users.</li>
              <li>Displaying targeted advertising on third party websites and services.</li>
              <li>Analyzing app usage and performance.</li>
              <li>Ensuring the security and integrity of the App.</li>
            </ul>
            
            <p><strong>Data Retention:</strong> We retain your data for as long as necessary to provide you with the App's services and for legitimate business purposes, such as fraud prevention and security. We may also retain your data to comply with legal obligations, resolve disputes, and enforce our agreements.</p>
            
            <p><strong>Legal Basis for Processing:</strong> We process your data based on your consent, contractual necessity, or our legitimate interests. You can withdraw your consent at any time through the by contacting us.</p>
          </section>
          
          <section className="policy-section">
            <h2>10. Miscellaneous</h2>
            <ul>
              <li>The App may modify these Terms at any time. Continued use of the App constitutes your acceptance of any changes.</li>
              <li>These Terms constitute the entire agreement between you and the App.</li>
              <li>Any provision of these Terms found invalid shall be severed, and the remainder of the Terms shall remain in effect.</li>
              <li>The relationship between you and the App is that of independent contractors.</li>
              <li>The App reserves the right to transfer or assign these Terms without restriction.</li>
            </ul>
          </section>
          
          <section className="policy-section">
            <h2>11. Contact</h2>
            <p>
              For questions, complaints, or claims, please contact: <a href="mailto:help@getkeeep.com">help@getkeeep.com</a>
            </p>
          </section>
        </div>
        
        <div className="back-to-home">
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
      
      <footer className="footer">
        <div className="footer-links">
          <Link to="/terms" className="footer-link">Terms and Conditions</Link>
          <span className="separator">|</span>
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}

export default TermsAndConditions; 