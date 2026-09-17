import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CookieConsent from 'react-cookie-consent';
import './App.css';

// Import page components
import Landing from './pages/Landing/Landing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Feedback from './pages/Feedback';
import WaitlistAndroid from './pages/WaitlistAndroid';

// Lazy-load the admin support app so its ~200KB chat SDK chunk only
// downloads when someone actually visits /admin/support — landing page
// bundle is unaffected.
const AdminSupport = React.lazy(() => import('./pages/admin/support/SupportApp'));

// Main App component with routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsAndConditions />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/waitlistAndroid" element={<WaitlistAndroid />} />
        <Route
          path="/admin/support/*"
          element={
            <Suspense fallback={<div style={{ padding: 24, fontFamily: '-apple-system, sans-serif' }}>Loading…</div>}>
              <AdminSupport />
            </Suspense>
          }
        />
      </Routes>

      <MarketingCookieConsent />
    </Router>
  );
}

// GDPR banner for the public marketing pages only. The /admin support tool
// sets no analytics cookies, and the banner eats half the screen on phones.
function MarketingCookieConsent() {
  const location = useLocation();
  // Path-segment match, not a raw prefix — a future marketing route like
  // /administration-tips must keep its banner.
  const { pathname } = location;
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return null;

  return (
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        declineButtonText="Decline"
        enableDeclineButton
        cookieName="keeepGDPRConsent"
        style={{
          background: "rgba(0, 0, 0, 0.85)",
          fontSize: "14px",
          padding: "20px",
        }}
        buttonStyle={{
          background: "#4CAF50",
          color: "white",
          fontSize: "14px",
          padding: "10px 30px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
        }}
        declineButtonStyle={{
          background: "transparent",
          color: "white",
          fontSize: "14px",
          padding: "10px 30px",
          borderRadius: "5px",
          border: "1px solid white",
          cursor: "pointer",
        }}
        expires={365}
        onAccept={() => {
          console.log("User accepted cookies");
          // Future: Initialize analytics here when needed
        }}
        onDecline={() => {
          console.log("User declined cookies");
        }}
      >
        This website uses cookies to enhance the user experience. By continuing to use this site, you consent to our use of cookies. See our{" "}
        <Link to="/privacy-policy" style={{ color: "#4CAF50", textDecoration: "underline" }}>
          Privacy Policy
        </Link>{" "}
        for more information.
      </CookieConsent>
  );
}

export default App;
