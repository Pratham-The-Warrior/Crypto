import React from "react";
import "./feature.css";

const features = [
  {
    title: "Secure Transactions",
    description:
      "Your assets are protected with cutting-edge encryption and multi-layer authentication.",
    icon: "🔒",
  },
  {
    title: "Low Fees",
    description:
      "Trade with some of the lowest fees in the industry — maximize your profits.",
    icon: "💸",
  },
  {
    title: "24/7 Support",
    description: "Get instant help from our expert team anytime, anywhere.",
    icon: "🕐",
  },
  {
    title: "Real-time Data",
    description:
      "Stay ahead with live market prices and analytics for every crypto asset.",
    icon: "📊",
  },
  {
    title: "Advanced Analytics",
    description:
      "Gain deeper insights into market trends with AI-powered analytics and performance tracking.",
    icon: "📈",
  },
  {
    title: "Mobile Friendly",
    description:
      "Trade and manage your portfolio seamlessly on any device, anywhere you go.",
    icon: "📱",
  },
];

const Features = () => {
  return (
    <section className="features-section">
      <div className="features-header">
        <h2>Our Key Features</h2>
        <p>
          Experience the future of crypto trading with our secure and intuitive
          platform.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
