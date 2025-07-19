import React from 'react';
import './CustomerSupport.css';

const CustomerSupport = () => {
  return (
    <div className="support-wrapper">
      <div className="support-container">
        <h1 className="support-heading">Customer Support</h1>
        <p className="support-subheading">
          We’re here to help! If you have questions, concerns, or need assistance, our team is ready to support you.
        </p>

        <div className="support-card">
          <div className="support-item">
            <h3>Email Support</h3>
            <p>
              Reach us at <a href="mailto:indradev03@gmail.com">indradev03@gmail.com</a> and we’ll get back within 24 hours.
            </p>
          </div>

          <div className="support-item">
            <h3>Phone Support</h3>
            <p>
              Call us at <a href="tel:+9779845441519">+977-9845441519</a> <br />
              Available 9:00 AM – 6:00 PM (Mon–Fri)
            </p>
          </div>

          <div className="support-item">
            <h3>Live Chat</h3>
            <p>
              Chat with our agents directly from the bottom-right chat icon during business hours.
            </p>
          </div>

          <div className="support-item">
            <h3>FAQs</h3>
            <p>
              For quick help, visit our <a href="/faq">FAQ Page</a> to find answers to common questions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
