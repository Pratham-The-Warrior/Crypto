import { useEffect, useState } from "react";
import "./CryptoNews.css";

export default function CryptoNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);

      // Load previous articles from localStorage so feed is not empty
      const storedArticles = JSON.parse(
        localStorage.getItem("cryptoNews") || "[]"
      );
      const lastFetch = Number(localStorage.getItem("cryptoNewsTime")) || 0;

      //  Only fetch if it’s been more than 20mins since last fetch
      if (
        Date.now() - lastFetch < 60 * 20 * 1000 &&
        storedArticles.length > 0
      ) {
        setArticles(storedArticles);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://api.thenewsapi.net/crypto?apikey=${API_KEY}&page=1&size=3`
        );
        const data = await res.json();

        // Handle both possible response structures
        const newArticles = data.data?.results || data.data || [];

        // Merge new ones (newest first) avoid duplicates and newest first
        const merged = [
          ...newArticles.filter(
            (newItem) =>
              !storedArticles.some(
                (old) => old.article_id === newItem.article_id
              )
          ),
          ...storedArticles,
        ];

        // Keep a max of 60
        const limited = merged.slice(0, 60);

        // currently i am using localstorage later in backend i will use database
        setArticles(limited);
        localStorage.setItem("cryptoNews", JSON.stringify(limited));
        localStorage.setItem("cryptoNewsTime", Date.now().toString());
      } catch (err) {
        console.error("Error fetching news:", err);
        // fallback to stored
        setArticles(storedArticles);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [API_KEY]);

  if (loading) {
    return <div className="news-loading">Fetching latest crypto news...</div>;
  }

  if (!loading && articles.length === 0) {
    return (
      <div className="news-empty">No crypto news available at the moment.</div>
    );
  }

  return (
    <div className="news-section">
      {/* <h2 className="news-heading">Latest Crypto News</h2> */}
      <div className="news-grid">
        {articles.map((item) => (
          <div key={item.article_id} className="news-card">
            {item.thumbnail && (
              <img
                src={item.thumbnail}
                alt={item.title}
                className="news-image"
              />
            )}
            <div className="news-content">
              <h3 className="news-title">{item.title}</h3>
              <p className="news-description">
                {item.description
                  ? item.description.slice(0, 120) + "..."
                  : "No description available."}
              </p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="news-link"
              >
                Read More →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
