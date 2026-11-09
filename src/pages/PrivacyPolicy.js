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
          <p className="last-updated">Last updated: November 8, 2026</p>

          <section className="policy-section">
            <h2>1. Who we are</h2>
            <p>
              Keeep is a group chat app where friends keep each other accountable to a fitness goal. Keeep is operated by
              DINOSAURFORMULA UNIPESSOAL, LDA, a private limited company registered in Portugal under number (NIPC) 518688445,
              with its registered office at Calçada do Tijolo, n.º 39, 2 E, 1200-464 Lisboa, Portugal ("Keeep", "we", "us").
            </p>
            <p>
              We are the data controller for the personal data described in this policy. For any privacy question or request,
              write to <a href="mailto:privacy@getkeeep.com">privacy@getkeeep.com</a>.
            </p>
            <p>
              This policy covers the Keeep app and the getkeeep.com website. Our <Link to="/terms-of-service">Terms of Use</Link> explain
              the rules for using Keeep.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. What we collect</h2>
            <p><strong>Account information.</strong> Your phone number, which we verify with a one-time code sent by SMS, your name, and the profile photo you choose to add.</p>
            <p><strong>Groups and activity.</strong> The groups you create or join, your goals, rounds, check-ins and +1s, and the messages, photos and reactions you share in your groups.</p>
            <p>
              <strong>Apple Health data.</strong> Only if you allow it in iOS. We read your workouts (type, start and end time, duration,
              distance, active energy and the app or device that recorded them) and your daily step counts. When you connect, we save your
              last 30 days of workouts and daily steps to your account. After that, we save the workouts and steps you share with a group.
            </p>
            <p>
              <strong>Contacts.</strong> Only if you allow it in iOS, and only to help you invite friends. Your address book stays on your phone.
              We receive only the phone numbers of the friends you choose to invite, so we can send the invite and recognise them when they join.
            </p>
            <p>
              <strong>Purchases.</strong> Apple processes every payment. We never see your card details. Apple tells us which plan you bought,
              whether you are in a free trial, renewal and cancellation dates, refunds, and whether an invite coupon was used.
            </p>
            <p>
              <strong>Device and usage information.</strong> Your device model, operating system, app version, time zone, language, IP address,
              the screens you visit and the actions you take in the app, and crash and error reports.
            </p>
            <p>
              <strong>Session replays.</strong> We record how some sessions move through the app's screens so we can find and fix confusing
              steps. Text, text fields and images are hidden in these recordings, so we cannot read your messages, your name or your photos
              in them.
            </p>
            <p><strong>Support.</strong> The messages you send to Keeep support, and anything you choose to tell us there.</p>
          </section>

          <section className="policy-section">
            <h2>3. How we use it, and why we are allowed to</h2>
            <ul>
              <li><strong>To run Keeep for you</strong> (your account, your groups, chat, goals, verifying workouts, invites, and your membership). Legal basis: performing our contract with you.</li>
              <li><strong>To verify workouts and show your activity to your group</strong> using Apple Health data. Legal basis: your explicit consent, which you give in iOS and can withdraw at any time.</li>
              <li><strong>To send your invites and match invited friends</strong> when they sign up. Legal basis: our legitimate interest, and your friend's, in connecting you.</li>
              <li><strong>To bill and manage memberships, trials and coupons</strong> with Apple, and to keep the records tax law requires. Legal basis: contract and legal obligation.</li>
              <li><strong>To send notifications</strong> about your group, your goal and your membership, such as a reminder before a free trial ends. Legal basis: contract. You can turn notifications off in iOS Settings.</li>
              <li><strong>To understand and improve Keeep</strong> with analytics, session replays and crash reports. Legal basis: our legitimate interest in a working, useful app.</li>
              <li><strong>To measure and improve our advertising</strong>, as described in section 6. Legal basis: your consent where the law requires it, otherwise our legitimate interest.</li>
              <li><strong>To keep Keeep safe</strong> and enforce our Terms, and to prevent fraud and abuse such as reusing free trials or coupons. Legal basis: our legitimate interest.</li>
              <li><strong>To meet legal obligations</strong> and answer lawful requests from authorities.</li>
            </ul>
            <p>We do not sell your personal data.</p>
          </section>

          <section className="policy-section">
            <h2>4. Your health data</h2>
            <p>
              We treat Apple Health data as sensitive. We use it only to verify workouts, track progress toward your goal and show your
              activity to the groups you are in. We never use it for advertising or marketing, never sell it, never share it with data brokers
              or advertising partners, and never store it in iCloud. Only the service providers in section 7 that host and run Keeep can
              process it, on our behalf.
            </p>
            <p>
              You can stop sharing at any time in iOS Settings, Health, Data Access and Devices, Keeep. To delete the health data we have
              already saved, delete your account or write to <a href="mailto:privacy@getkeeep.com">privacy@getkeeep.com</a>.
            </p>
            <p>Keeep is not a medical service, and nothing in it is medical advice.</p>
          </section>

          <section className="policy-section">
            <h2>5. What other people can see</h2>
            <p>
              Members of your groups see your name, photo, messages, photos, goal, progress, check-ins, +1s and the workouts you share.
              People you invite see your name, your group's name and goal, and the invite link and code. Anyone with an invite link can see
              its preview.
            </p>
          </section>

          <section className="policy-section">
            <h2>6. Advertising and measurement</h2>
            <p>
              We advertise Keeep on platforms such as Meta (Facebook and Instagram) and TikTok, and we use AppsFlyer to measure which
              ads bring people to Keeep.
            </p>
            <p>
              On iPhone, we only link your activity in Keeep with data from other companies' apps and websites, or use your device's
              advertising identifier, if you allow it when iOS asks whether Keeep can track you. If you allow it, we may share your
              advertising identifier and in-app events (such as signing up or starting a membership) with AppsFlyer and our advertising
              partners, to measure our ads and to show Keeep ads to you or to people like you. If you don't allow it, we only use Apple's
              privacy-preserving ad measurement (SKAdNetwork), which does not identify you. You can change your choice at any time in iOS
              Settings, Privacy and Security, Tracking.
            </p>
            <p>Health data and your messages are never used for advertising.</p>
          </section>

          <section className="policy-section">
            <h2>7. Who we share it with</h2>
            <p>We share personal data only with these parties, and only for the purposes above:</p>
            <ul>
              <li><strong>Service providers that run Keeep for us:</strong> Heroku (Salesforce) and Amazon Web Services for hosting and our database; Stream for chat; Twilio for SMS codes and invites; Apple for payments and push notifications; PostHog for analytics and session replays; Sentry for crash and error reports; Netlify for our website.</li>
              <li><strong>Measurement and advertising partners</strong> (AppsFlyer, Meta, TikTok), as described in section 6.</li>
              <li><strong>Other users,</strong> as described in section 5.</li>
              <li><strong>Authorities</strong> when the law requires it, and professional advisers such as lawyers and accountants.</li>
              <li><strong>A buyer or successor</strong> if Keeep is sold or merged, who must keep protecting your data as this policy describes.</li>
            </ul>
            <p>Our service providers may only use your data to provide their service to us, under contracts that require them to protect it.</p>
          </section>

          <section className="policy-section">
            <h2>8. Security and messages</h2>
            <p>
              Your data is encrypted in transit and at rest with our hosting and chat providers. Your messages are not end-to-end encrypted.
              Access to them is limited to what is needed to run Keeep, answer support requests you send us, investigate reports of abuse,
              and meet legal obligations. No system is perfectly secure, and we cannot guarantee that your data will never be accessed
              without authorisation. If a breach puts your rights at risk, we will tell you and the authorities as the law requires.
            </p>
          </section>

          <section className="policy-section">
            <h2>9. International transfers</h2>
            <p>
              Several of our providers store or process data in the United States and other countries outside the European Economic Area.
              When we transfer data out of the EEA, we rely on the EU-U.S. Data Privacy Framework where the provider is certified, or on the
              European Commission's Standard Contractual Clauses.
            </p>
          </section>

          <section className="policy-section">
            <h2>10. How long we keep it</h2>
            <ul>
              <li>Account, group and health data: while your account is open. When you delete your account, we delete it from our database straight away.</li>
              <li>Messages: when you delete your account, your messages are marked deleted and hidden from everyone. Our chat provider may keep a copy for a limited time before it is erased.</li>
              <li>Phone numbers of friends you invited who never joined: up to 12 months.</li>
              <li>Analytics, session replays and crash reports: up to 12 months.</li>
              <li>Purchase records: as long as tax and accounting law requires, up to 10 years.</li>
              <li>Backups: overwritten on a rolling basis, within 90 days.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>11. Your rights</h2>
            <p>You can ask us to:</p>
            <ul>
              <li>give you a copy of your data, including in a portable format;</li>
              <li>correct it;</li>
              <li>delete it (you can delete your account yourself in the app, under Settings);</li>
              <li>restrict or object to how we use it, including for direct marketing;</li>
              <li>withdraw any consent you gave, without affecting what we did before.</li>
            </ul>
            <p>
              Write to <a href="mailto:privacy@getkeeep.com">privacy@getkeeep.com</a>. We answer within one month and may need to confirm
              it's you first. You can also complain to your local data protection authority. In Portugal this is the Comissão Nacional de
              Proteção de Dados (<a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer">www.cnpd.pt</a>).
            </p>
            <p>
              <strong>California residents</strong> have the right to know, delete and correct their personal information, to opt out of
              its "sale" or "sharing" for cross-context behavioural advertising, and not to be treated differently for using these rights.
              We don't sell personal information for money. Sharing for advertising happens only if you allow tracking in iOS, and you can
              turn it off there at any time or write to us.
            </p>
          </section>

          <section className="policy-section">
            <h2>12. Children</h2>
            <p>
              Keeep is not meant for children under 13, and we do not knowingly collect personal data from them. If you believe a child
              under 13 has given us personal data, write to <a href="mailto:privacy@getkeeep.com">privacy@getkeeep.com</a> and we will delete it.
            </p>
          </section>

          <section className="policy-section">
            <h2>13. Cookies on our website</h2>
            <p>
              getkeeep.com uses essential cookies to work and to remember your cookie choice, and analytics cookies only if you accept them
              in the cookie banner. You can withdraw consent at any time by clearing your browser cookies or writing to us.
            </p>
          </section>

          <section className="policy-section">
            <h2>14. Changes to this policy</h2>
            <p>
              We may update this policy. If a change is significant, we will tell you in the app or by another reasonable means before it
              takes effect. The date at the top shows the latest version.
            </p>
          </section>

          <section className="policy-section">
            <h2>15. Contact</h2>
            <p>
              DINOSAURFORMULA UNIPESSOAL, LDA, Calçada do Tijolo, n.º 39, 2 E, 1200-464 Lisboa, Portugal.
              Email: <a href="mailto:privacy@getkeeep.com">privacy@getkeeep.com</a>.
            </p>
          </section>
        </div>

        <div className="back-to-home">
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-links">
          <Link to="/terms-of-service" className="footer-link">Terms of Use</Link>
          <span className="separator">|</span>
          <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}

export default PrivacyPolicy;
