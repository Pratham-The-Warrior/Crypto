import CryptoNews from "../../components/CryptoNews/CryptoNews";
import "./NewsPage.css";
import { motion } from "framer-motion";

export default function NewsPage() {
  return (
    <div className="news-page">
      <motion.div
        className="news-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="news-page-title">Stay Updated with Crypto World</h1>
        <p className="news-page-subtitle">
          Explore the latest cryptocurrency trends, insights, and updates in
          real time.
        </p>
        <div className="news-divider"></div>
      </motion.div>

      <CryptoNews />
    </div>
  );
}
