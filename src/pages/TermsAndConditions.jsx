import React from 'react';
import './TermsAndConditions.css';

const TermsAndConditions = () => {
  return (
    <div className="terms-wrapper">
      <div className="terms-container">
        <h1 className="terms-heading">Terms and Conditions</h1>
        <p className="terms-intro">
          Please read the following Terms and Conditions carefully before using our services.
        </p>

        <div className="terms-box">
        <ul className="terms-list">
            <li>Acceptance of Terms: By accessing or using our platform, you agree to be bound by these Terms and Conditions.</li>
            <li>Eligibility: Users must be at least 18 years old or have parental consent to use our services.</li>
            <li>Account Registration: You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li>Accurate Information: All personal information provided must be accurate and up to date.</li>
            <li>Account Suspension: We reserve the right to suspend accounts for suspicious or fraudulent behavior.</li>
            <li>Product Descriptions: We strive for accuracy, but do not guarantee that all descriptions are complete or error-free.</li>
            <li>Pricing: Prices are subject to change without prior notice due to market fluctuation.</li>
            <li>Order Confirmation: An order is confirmed only after you receive an official confirmation email.</li>
            <li>Payment: All payments must be made through approved payment gateways on our site.</li>
            <li>Failed Payments: Orders may be canceled if payment fails or is reversed.</li>
            <li>Taxes: All applicable taxes are the responsibility of the buyer.</li>
            <li>Delivery Times: Delivery estimates are provided for convenience only and are not guaranteed.</li>
            <li>Shipping Partners: We work with third-party logistics and are not responsible for delays caused by them.</li>
            <li>Address Accuracy: Users must provide correct shipping details. We are not liable for delivery to incorrect addresses.</li>
            <li>Risk of Loss: Risk of loss or damage transfers to the buyer upon dispatch.</li>
            <li>Returns Policy: Returns are accepted within 7 days of delivery for eligible products.</li>
            <li>Refunds: Approved refunds are processed within 5-10 business days.</li>
            <li>Non-returnable Items: Certain items such as opened accessories may not be returnable.</li>
            <li>Warranty: Product warranties, if any, are mentioned in the product description or manufacturer documents.</li>
            <li>Condition Disclosure: Used phones are sold with disclosed battery health and cosmetic condition.</li>
            <li>Data Deletion: Pre-owned phones are factory reset and all data is wiped before delivery.</li>
            <li>User Conduct: You agree not to misuse the platform or interfere with other users' experiences.</li>
            <li>Prohibited Uses: The platform must not be used for illegal or unauthorized purposes.</li>
            <li>Security: Users must not attempt to access unauthorized sections of the site or perform hacking attempts.</li>
            <li>Copyright: All content on this site is owned by the company and protected by copyright laws.</li>
            <li>Trademarks: All brand logos used are trademarks of their respective owners.</li>
            <li>User Content: By posting reviews or comments, you grant us the right to use and display them publicly.</li>
            <li>Feedback: We may use your feedback for improvement and promotional purposes without compensation.</li>
            <li>Third-Party Links: We are not responsible for content on external websites linked from our platform.</li>
            <li>Promotions: Offers and discounts are subject to specific terms and may be revoked at any time.</li>
            <li>Coupons: Coupons are non-transferable and cannot be combined unless stated otherwise.</li>
            <li>Account Termination: We reserve the right to terminate accounts violating our policies.</li>
            <li>Privacy: Your personal information is handled as per our Privacy Policy.</li>
            <li>Cookies: We use cookies to enhance your browsing experience and analyze traffic.</li>
            <li>Location Access: Location data may be used to provide better regional services.</li>
            <li>Mobile Access: The platform is optimized for mobile, but full functionality may vary by device.</li>
            <li>Data Backup: You are responsible for backing up data before selling or exchanging devices.</li>
            <li>Service Availability: We do not guarantee uninterrupted access to the platform.</li>
            <li>Maintenance: Scheduled or emergency maintenance may lead to temporary unavailability.</li>
            <li>Changes to Terms: We may update these terms at any time. Continued use implies acceptance.</li>
            <li>Notifications: Important updates may be sent via email or posted on the website.</li>
            <li>Governing Law: These terms are governed by the laws of your local jurisdiction.</li>
            <li>Dispute Resolution: Disputes will be resolved through arbitration or mediation before court proceedings.</li>
            <li>Limitation of Liability: We are not liable for any indirect or consequential losses.</li>
            <li>Indemnification: You agree to indemnify us against any claims arising from your use of the platform.</li>
            <li>Force Majeure: We are not liable for delays caused by events beyond our control.</li>
            <li>Language: The terms are available in English and may be translated for reference only.</li>
            <li>Updates: Terms may change without individual notice; check regularly for updates.</li>
            <li>Account Sharing: You may not share your account credentials with others.</li>
            <li>One Account Policy: Users may only create one account unless otherwise approved.</li>
            <li>Device Authenticity: We do not sell counterfeit or cloned devices.</li>
            <li>Phone Lock: All devices are verified for iCloud/Google account lock status.</li>
            <li>IMEI: Devices are IMEI-checked and certified as non-blacklisted.</li>
            <li>Reselling: Reselling our products without consent is prohibited.</li>
            <li>Affiliate Program: Participation in the affiliate program is subject to additional terms.</li>
            <li>Customer Reviews: Reviews must be truthful and relevant to the product or service.</li>
            <li>Ratings: Ratings suspected to be fake or manipulated will be removed.</li>
            <li>Order Cancellations: Orders can be canceled before dispatch, subject to cancellation policy.</li>
            <li>Account Verification: We may request ID verification for security reasons.</li>
            <li>Bulk Orders: Bulk or business orders must be approved in advance.</li>
            <li>Chat Support: Live chat is monitored and abusive behavior is not tolerated.</li>
            <li>Language Policy: Offensive language in messages, reviews, or usernames is not permitted.</li>
            <li>Content Removal: We reserve the right to remove any user-submitted content at our discretion.</li>
            <li>Exchange Program: Participation in phone exchange programs is governed by separate terms.</li>
            <li>Condition Disclosure: Device conditions (e.g., scratches, dents) are disclosed before sale.</li>
            <li>Environmental Policy: We support recycling and proper disposal of electronic waste.</li>
            <li>Software Policy: We do not install pirated software or unofficial firmware on devices.</li>
            <li>Battery Health: Used phones are sold with battery health above 80%, unless stated otherwise.</li>
            <li>Original Accessories: Accessories included with products are either original or certified compatible.</li>
            <li>Out-of-Stock: If a product becomes unavailable after your order, a refund or substitution will be offered.</li>
            <li>Pre-orders: Pre-ordered items are delivered based on manufacturer release dates.</li>
            <li>Referral Program: Referral bonuses are subject to verification and fraud checks.</li>
            <li>Review Incentives: Any incentive-based reviews must be clearly disclosed by the reviewer.</li>
            <li>Return Shipping: The cost of return shipping may be borne by the customer unless the fault is ours.</li>
            <li>Order Status: You can track your order through your account dashboard.</li>
            <li>Packaging: Devices are packaged securely, but we are not liable for damage in transit.</li>
            <li>Pickup: In-store pickup may be available in select locations.</li>
            <li>Time Zone: All timelines are based on Nepal Standard Time (NPT).</li>
            <li>Device Photos: Product images are representative; actual product may vary slightly.</li>
            <li>Contact Channels: Support is available via phone, email, and chat during business hours.</li>
            <li>Fake Orders: Fake, prank, or malicious orders will result in account suspension and possible legal action.</li>
            <li>Login Sessions: Sessions may expire after a set period of inactivity.</li>
            <li>Browser Support: We recommend using the latest versions of Chrome, Firefox, or Safari.</li>
            <li>Policy Violations: Repeated policy violations may result in permanent bans.</li>
            <li>Legal Compliance: Users must comply with all applicable local, state, and international laws.</li>
            <li>Grievance: Any legal grievance can be reported to our compliance officer via support email.</li>
            <li>Final Authority: In all disputes, the company reserves final interpretation rights.</li>
            <li>Thank You: Thank you for choosing our service. We’re committed to your satisfaction and trust.</li>
        </ul>

        </div>

        <p className="terms-footer">
          If you do not agree with any of these terms, please discontinue using our service.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
