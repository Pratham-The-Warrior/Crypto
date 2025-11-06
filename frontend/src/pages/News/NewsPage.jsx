import CryptoNews from "../../components/CryptoNews/CryptoNews";
import "./NewsPage.css";

export default function NewsPage() {
  return (
    <div className="news-page">
      <div className="news-header">
        <h1 className="news-page-title">Stay Updated with Crypto World</h1>
        <p className="news-page-subtitle">
          Explore the latest cryptocurrency trends, insights, and updates in
          real time.
        </p>
        <div className="news-divider"></div>
      </div>

      <CryptoNews />
    </div>
  );
}
