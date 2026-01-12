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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="features-section">
      <motion.div
        className="features-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2>Why Choose CoinHub?</h2>
        <p>
          We provide the tools, security, and speed you need to trade with confidence.
          Experience the next generation of crypto exchange.
        </p>
      </motion.div>

      <motion.div
        className="features-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature, index) => (
          <motion.div
            className="feature-card"
            key={index}
            variants={cardVariants}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Features;
