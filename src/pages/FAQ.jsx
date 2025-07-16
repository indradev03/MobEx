import React, { useState } from 'react';
import './FAQ.css';

const faqs = [
  {
    question: "What is MobileXchange?",
    answer: "MobileXchange is an online platform where you can buy, sell, and exchange smartphones at competitive prices.",
  },
  {
    question: "How do I exchange my old smartphone?",
    answer: "Go to the product details page of the phone you want to buy, click on 'Exchange Your Smartphone', fill out the form with your old phone's details, and get an estimated price deduction.",
  },
  {
    question: "Is there a warranty on the phones?",
    answer: "Yes, all our devices come with a limited warranty which may vary based on product condition (new/refurbished). Details are available on the product page.",
  },
  {
    question: "How do I track my order?",
    answer: "Once your order is placed, you can track it from your profile under 'My Orders'. We'll also send email updates.",
  },
  {
    question: "Can I return a product?",
    answer: "Yes, you can return a product within 7 days of delivery if it is defective or not as described.",
  },
  {
    question: "Are the phones new or refurbished?",
    answer: "We offer both new and professionally refurbished smartphones. The product page specifies the condition clearly.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept credit/debit cards, digital wallets, and cash on delivery (COD) in selected regions.",
  },
  {
    question: "Do I need an account to buy or sell?",
    answer: "Yes, creating an account allows us to provide order tracking, purchase history, and faster checkouts.",
  },
  {
    question: "How do I sell my phone?",
    answer: "Go to the 'Sell' section, enter your device details, get an estimated price, and schedule a pickup.",
  },
  {
    question: "How long does delivery take?",
    answer: "Delivery usually takes 2-5 business days depending on your location.",
  },
  {
    question: "What is the exchange policy?",
    answer: "You can exchange eligible smartphones and get instant discounts during checkout after verification.",
  },
  {
    question: "Is there any exchange bonus?",
    answer: "Occasionally, we offer special exchange bonuses during campaigns. Check our homepage for offers.",
  },
  {
    question: "Are EMI options available?",
    answer: "Yes, EMI (Equated Monthly Installments) options are available for selected cards and banks.",
  },
  {
    question: "Is my data safe when I sell a phone?",
    answer: "Yes, we recommend factory resetting your phone before handover. We also perform professional data wipes.",
  },
  {
    question: "Can I cancel my order?",
    answer: "Orders can be cancelled before shipping. Go to 'My Orders' to cancel or contact support.",
  },
  {
    question: "How do I contact customer support?",
    answer: "You can reach us via live chat, email, or phone through our 'Contact Us' page.",
  },
  {
    question: "Do you offer international shipping?",
    answer: "Currently, we operate within selected regions. International shipping is not yet available.",
  },
  {
    question: "What brands are available?",
    answer: "We offer top brands like Apple, Samsung, Xiaomi, OnePlus, Google Pixel, and more.",
  },
  {
    question: "What happens if my phone gets damaged during shipping?",
    answer: "We ensure proper packaging, but if any damage occurs, contact us immediately for a resolution.",
  },
  {
    question: "Do I get a bill/invoice for my purchase?",
    answer: "Yes, a digital invoice will be available in your account and also sent to your email after purchase.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="faq-container">
      <h1 className="faq-heading">Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqs.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
          >
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <span>{item.question}</span>
              <span>{activeIndex === index ? '−' : '+'}</span>
            </div>
            {activeIndex === index && (
              <div className="faq-answer">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
