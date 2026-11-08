import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function TermsAndConditions() {
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

        <h1 className="policy-title">Terms of Use</h1>

        <div className="policy-container">
          <p className="last-updated">Last updated: November 8, 2026</p>

          <section className="policy-section">
            <h2>1. About these Terms</h2>
            <p>
              These Terms of Use ("Terms") are an agreement between you and DINOSAURFORMULA UNIPESSOAL, LDA, a private limited company
              registered in Portugal under number (NIPC) 518688445, with its registered office at Calçada do Tijolo, n.º 39, 2 E,
              1200-464 Lisboa, Portugal ("Keeep", "we", "us"). They cover the Keeep app and getkeeep.com (together, the "Service").
            </p>
            <p>
              By creating an account, starting a free trial, buying a membership or otherwise using the Service, you agree to these Terms
              and confirm that you have read our <Link to="/privacy-policy">Privacy Policy</Link>. If you don't agree, don't use the Service.
            </p>
            <p>
              <strong>If you live in the United States, section 16 contains a binding arbitration agreement and a class action waiver that
              affect how disputes are resolved. Please read it.</strong>
            </p>
          </section>

          <section className="policy-section">
            <h2>2. Who can use Keeep</h2>
            <p>
              You must be at least 13 years old, and old enough to agree to these Terms where you live. If you are under the age of majority
              where you live, a parent or guardian must agree to these Terms for you and is responsible for your use, including purchases.
              You must give us accurate information, use a phone number you control, and keep your device and account secure. You are
              responsible for everything done through your account.
            </p>
          </section>

          <section className="policy-section">
            <h2>3. What Keeep is, and what it is not</h2>
            <p>
              Keeep lets you form small groups, set a shared fitness goal, chat, and log workouts, which can be verified with Apple Health.
              Groups have a limited number of spots; when a group is full, a new member may need to wait for a spot, ask the host, or start
              a new group.
            </p>
            <p>
              <strong>Keeep is not a medical, health or fitness professional service, and nothing in it is medical advice.</strong> Talk to
              a doctor before starting or changing an exercise programme, especially if you have a health condition, are pregnant, or have
              not exercised in a while. Stop and seek help if you feel pain, faintness or shortness of breath. You exercise at your own risk
              and are responsible for choosing activities that are safe for you. Workout and step data come from Apple Health and the apps
              and devices that feed it, and may be incomplete or inaccurate.
            </p>
          </section>

          <section className="policy-section">
            <h2>4. Memberships, free trials and billing</h2>
            <p>
              <strong>Plans.</strong> Keeep requires a membership. We offer monthly and yearly memberships that renew automatically, and a
              lifetime membership paid once. The plans, prices (including taxes where applicable) and any free trial are shown in the app
              before you buy, and may differ by country and over time.
            </p>
            <p>
              <strong>Apple is the seller.</strong> All purchases are made through your Apple ID and processed by Apple under the Apple
              Media Services Terms and Conditions. We never receive your card details.
            </p>
            <p>
              <strong>Automatic renewal.</strong> Monthly and yearly memberships renew automatically at the end of each period, and Apple
              charges your Apple ID at the then-current price, unless you turn off auto-renew at least 24 hours before the period ends.
              You can manage or cancel in iPhone Settings, your name, Subscriptions. Deleting the app or your Keeep account does not cancel
              a subscription. When you cancel, you keep access until the end of the period you paid for.
            </p>
            <p>
              <strong>Free trials.</strong> Some plans include a free trial, shown before you start it. Unless you cancel at least 24 hours
              before the trial ends, the membership starts and Apple charges you automatically when the trial ends. Each person may use a
              free trial only once, as Apple's rules determine.
            </p>
            <p>
              <strong>Lifetime membership.</strong> A lifetime membership is a one-time purchase that gives the buyer access to Keeep's
              membership features for as long as Keeep offers the Service. It covers only the person who bought it.
            </p>
            <p>
              <strong>Late-join fee.</strong> Joining a group's round after it has started may require a one-time fee, shown before you pay.
            </p>
            <p>
              <strong>Price changes.</strong> We may change prices. Changes to a subscription you already have take effect at your next
              renewal, after Apple notifies you and, where the law or Apple's rules require it, asks for your consent.
            </p>
            <p>
              <strong>Refunds.</strong> Because Apple processes payments, refund requests go to Apple at
              {' '}<a href="https://reportaproblem.apple.com" target="_blank" rel="noopener noreferrer">reportaproblem.apple.com</a>.
              We cannot issue refunds for App Store purchases. Except where the law requires otherwise, payments are not refundable and we
              do not give credit for partly used periods.
            </p>
            <p>
              <strong>EU and UK consumers.</strong> You get immediate access to digital content when your purchase is confirmed. By buying,
              you ask for that access to start straight away, and you acknowledge that you lose your 14-day right of withdrawal once it has
              started, as the law allows. Your statutory rights otherwise remain unaffected.
            </p>
          </section>

          <section className="policy-section">
            <h2>5. Invite coupons</h2>
            <p>
              Some invites include a coupon, such as a free trial period, given by the person who invited you. Each coupon can be used once,
              by the first eligible person who claims it. A coupon is held for you while your free trial runs, is used when your first
              payment goes through, and is released if your trial ends without payment, you cancel before the first charge, or the purchase
              is refunded or not completed. Coupons have no cash value, cannot be sold, transferred or exchanged, and may expire. We may
              cancel coupons that were obtained by fraud, automation, multiple accounts or in breach of these Terms, and may change or end
              the coupon programme at any time without affecting coupons already used.
            </p>
          </section>

          <section className="policy-section">
            <h2>6. Your content</h2>
            <p>
              You keep ownership of the messages, photos and other content you share ("Your Content"). You give us a worldwide,
              non-exclusive, royalty-free licence to host, store, copy, process, display and transmit Your Content only as needed to run,
              secure and improve the Service and to show it to the people you share it with. This licence ends when Your Content is deleted
              from the Service, except for copies we must keep by law or that others have already received.
            </p>
            <p>
              You are responsible for Your Content and confirm that you have the rights to share it. Content you post in a group can be seen,
              saved and shared by its members, and we cannot control what they do with it.
            </p>
          </section>

          <section className="policy-section">
            <h2>7. Rules of conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>post anything illegal, threatening, harassing, hateful, sexually explicit, violent, or that infringes someone else's rights;</li>
              <li>impersonate anyone, or invite people without their permission or in a way that amounts to spam;</li>
              <li>fake, alter or misrepresent workouts or health data;</li>
              <li>abuse free trials, coupons, invites or referrals, including through multiple or fake accounts;</li>
              <li>reverse engineer, scrape, overload, or interfere with the Service, or access it by automated means;</li>
              <li>use the Service for commercial purposes without our written permission;</li>
              <li>help or encourage anyone else to do any of these things.</li>
            </ul>
            <p>
              We may review, remove or restrict content, and limit, suspend or close accounts, when we reasonably believe these Terms or the
              law have been broken. You can report content or users to <a href="mailto:help@getkeeep.com">help@getkeeep.com</a>.
            </p>
          </section>

          <section className="policy-section">
            <h2>8. Contacts and invites</h2>
            <p>
              When you invite people, you confirm that you know them and that they would welcome the invite. Standard carrier rates for
              messages sent from your phone may apply.
            </p>
          </section>

          <section className="policy-section">
            <h2>9. Our rights</h2>
            <p>
              The Service, including its software, design, text, graphics and the Keeep name and logo, belongs to us or our licensors. We
              give you a personal, revocable, non-exclusive, non-transferable licence to use the app on Apple devices you own or control, for
              your own non-commercial use, under these Terms and Apple's usage rules. If you send us feedback or ideas, we may use them freely
              without paying you.
            </p>
          </section>

          <section className="policy-section">
            <h2>10. Third-party services</h2>
            <p>
              The Service relies on services from other companies, such as Apple (App Store and Apple Health), and may link to other
              websites. We are not responsible for third-party services or content, and your use of them is governed by their own terms.
            </p>
          </section>

          <section className="policy-section">
            <h2>11. Changes to the Service and these Terms</h2>
            <p>
              We may add, change or remove features, or stop offering the Service, to improve it, for legal, security or technical reasons,
              or for business reasons. If we stop offering the Service entirely, we will give reasonable notice where possible. We may update
              these Terms. If a change is significant, we will tell you in the app or by another reasonable means at least 15 days before it
              takes effect. If you keep using the Service after that, you accept the new Terms; if you don't agree, stop using the Service and
              cancel your subscription.
            </p>
          </section>

          <section className="policy-section">
            <h2>12. Ending your account</h2>
            <p>
              You can delete your account at any time in the app, under Settings. Remember to cancel any subscription with Apple separately.
              We may suspend or close your account, with notice where reasonable, if you break these Terms, if required by law, or to protect
              users or the Service. Sections that by their nature should continue after your account ends (including 6, 9, 13, 14, 15 and 16)
              will continue.
            </p>
          </section>

          <section className="policy-section">
            <h2>13. Disclaimers</h2>
            <p>
              To the fullest extent permitted by law, the Service is provided "as is" and "as available", without warranties of any kind,
              whether express or implied, including warranties of merchantability, fitness for a particular purpose, accuracy and
              non-infringement. We do not promise that the Service will be uninterrupted, error-free or secure, that it will help you reach
              any fitness or health result, or that other users will behave in any particular way. We are not responsible for the conduct of
              users, on or off the Service.
            </p>
          </section>

          <section className="policy-section">
            <h2>14. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, Keeep and its directors, employees and suppliers will not be liable for any indirect,
              incidental, special, consequential, exemplary or punitive damages, or for loss of profits, revenue, data, goodwill, or for
              any injury arising from physical activity, whatever the legal theory, even if we were told such damage was possible.
            </p>
            <p>
              To the fullest extent permitted by law, our total liability for all claims relating to the Service is limited to the greater
              of the amount you paid for Keeep in the 12 months before the claim arose, or EUR 50.
            </p>
            <p>
              Nothing in these Terms limits or excludes liability that cannot be limited or excluded by law, including liability for death
              or personal injury caused by our negligence, for fraud, or for wilful misconduct or gross negligence. If you are a consumer in
              the European Union or the United Kingdom, you also keep the mandatory rights the law gives you, and these Terms do not take them
              away.
            </p>
          </section>

          <section className="policy-section">
            <h2>15. Indemnity</h2>
            <p>
              To the extent permitted by law, you agree to defend, indemnify and hold harmless Keeep and its directors, employees and
              suppliers from claims, losses and costs (including reasonable legal fees) that arise from Your Content, your misuse of the
              Service, or your breach of these Terms or of the law. This section does not apply to consumers where the law does not allow it.
            </p>
          </section>

          <section className="policy-section">
            <h2>16. Governing law and disputes</h2>
            <p>
              <strong>Talk to us first.</strong> Most problems can be solved quickly. Before starting any claim, please write to
              {' '}<a href="mailto:help@getkeeep.com">help@getkeeep.com</a> with a description of the problem, and give us 30 days to try to
              resolve it.
            </p>
            <p>
              <strong>Governing law.</strong> These Terms are governed by the laws of Portugal. If you are a consumer, this does not take
              away the protection of the mandatory laws of the country where you live.
            </p>
            <p>
              <strong>Courts.</strong> The courts of Lisbon, Portugal, have jurisdiction over any dispute, except that if you are a consumer
              living in the European Union or the United Kingdom, you may also bring a claim in the courts of the country where you live.
            </p>
            <p>
              <strong>Consumer dispute resolution in Portugal.</strong> If we cannot resolve a dispute, you may use an alternative consumer
              dispute resolution entity, such as the Centro Nacional de Informação e Arbitragem de Conflitos de Consumo
              (CNIACC, <a href="https://www.cniacc.pt" target="_blank" rel="noopener noreferrer">www.cniacc.pt</a>). More entities are listed
              at <a href="https://www.consumidor.gov.pt" target="_blank" rel="noopener noreferrer">www.consumidor.gov.pt</a>. You may also
              file a complaint in the electronic complaints book
              at <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer">www.livroreclamacoes.pt</a>.
            </p>
            <p>
              <strong>Arbitration for users in the United States.</strong> If you live in the United States, you and Keeep agree to resolve
              any dispute relating to the Service or these Terms by final and binding individual arbitration administered by the American
              Arbitration Association under its Consumer Arbitration Rules, instead of in court, except that either party may bring an
              individual claim in small claims court, and either party may seek an injunction in court to stop infringement of intellectual
              property. The arbitration will take place in the county where you live or by video, and the Federal Arbitration Act governs this
              agreement. <strong>You and Keeep each waive the right to a jury trial and to take part in a class action, class arbitration or
              representative action.</strong> If this class waiver is found unenforceable for a claim, that claim must be heard in court and
              this arbitration agreement does not apply to it. You may opt out of this arbitration agreement by emailing
              {' '}<a href="mailto:help@getkeeep.com">help@getkeeep.com</a> within 30 days of first accepting these Terms, with your name,
              phone number and a clear statement that you opt out.
            </p>
            <p>
              <strong>Time limit.</strong> To the extent permitted by law, any claim must be brought within one year after it arose.
            </p>
          </section>

          <section className="policy-section">
            <h2>17. Apple</h2>
            <p>If you got the app from Apple's App Store, you and we also agree that:</p>
            <ul>
              <li>these Terms are between you and Keeep, not Apple, and Keeep, not Apple, is responsible for the app and its content;</li>
              <li>Apple has no obligation to provide maintenance or support for the app;</li>
              <li>if the app fails to meet an applicable warranty, you may notify Apple, and Apple will refund the purchase price, if any; to the extent permitted by law, Apple has no other warranty obligation for the app;</li>
              <li>Keeep, not Apple, is responsible for handling any claims about the app, including product liability claims, claims that it fails to meet legal or regulatory requirements, and consumer protection, privacy or similar claims;</li>
              <li>Keeep, not Apple, is responsible for investigating, defending and settling any claim that the app infringes someone's intellectual property rights;</li>
              <li>you confirm that you are not located in a country subject to a U.S. Government embargo or designated as a "terrorist supporting" country, and are not on any U.S. Government list of prohibited or restricted parties;</li>
              <li>Apple and its subsidiaries are third-party beneficiaries of these Terms and may enforce them against you.</li>
            </ul>
            <p>Apple's standard Licensed Application End User License Agreement also applies to your use of the app, and these Terms add to it.</p>
          </section>

          <section className="policy-section">
            <h2>18. General</h2>
            <ul>
              <li>These Terms and the Privacy Policy are the entire agreement between you and us about the Service.</li>
              <li>If any part of these Terms is found unenforceable, the rest stays in effect, and that part is applied to the fullest extent allowed.</li>
              <li>If we don't enforce a right, that is not a waiver of it.</li>
              <li>You may not transfer your rights under these Terms. We may transfer ours to a company that takes over the Service, without reducing your rights.</li>
              <li>We are not responsible for delays or failures caused by events beyond our reasonable control.</li>
              <li>These Terms are written in English. If we provide a translation, the English version prevails to the extent permitted by law.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>19. Contact</h2>
            <p>
              DINOSAURFORMULA UNIPESSOAL, LDA, Calçada do Tijolo, n.º 39, 2 E, 1200-464 Lisboa, Portugal. NIPC 518688445.
              Email: <a href="mailto:help@getkeeep.com">help@getkeeep.com</a>.
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

export default TermsAndConditions;
