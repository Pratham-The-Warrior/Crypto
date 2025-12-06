import React from "react";
import "./feature.css";
import { motion } from "framer-motion";

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
    <div className="features-section">
      <motion.div
        className="features-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>Our Key Features</h2>
        <p>
          Experience the future of crypto trading with our secure and intuitive
          platform.
        </p>
      </motion.div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <motion.div
            className="feature-card"
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Features;
