import React from "react";
import "./Pricing.css";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "Perfect for beginners exploring the crypto world.",
    features: [
      "Real-time market data",
      "Basic analytics",
      "Secure transactions",
      "Community support",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$5",
    period: "/month",
    description: "For active traders who need advanced tools and insights.",
    features: [
      "All Starter features",
      "Advanced analytics dashboard",
      "Priority 24/7 support",
      "Lower trading fees",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$20",
    period: "/month",
    description: "For institutions and high-volume traders.",
    features: [
      "All Pro features",
      "Dedicated account manager",
      "Custom API access",
      "Early feature access",
    ],
    highlighted: false,
  },
];

const Pricing = () => {
  return (
    <section className="pricing-section">
      <div className="pricing-header">
        <h2>Pricing Plans</h2>
        <p>Choose the plan that fits your trading style.</p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`pricing-card ${plan.highlighted ? "highlighted" : ""}`}
          >
            <h3 className="plan-name">{plan.name}</h3>
            <p className="plan-description">{plan.description}</p>
            <div className="plan-price">
              <span className="price">{plan.price}</span>
              <span className="period">{plan.period}</span>
            </div>
            <ul className="plan-features">
              {plan.features.map((feature, i) => (
                <li key={i}>✅ {feature}</li>
              ))}
            </ul>
            <button className="plan-button">
              {plan.highlighted ? "Get Started" : "Choose Plan"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
