import React from 'react';
import Card from '../common/Card';
import Loading from '../common/Loading';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  snippet: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  sentimentScore?: number;
}

interface StockNewsProps {
  symbol: string;
  news: NewsItem[];
  loading?: boolean;
  error?: string | null;
  className?: string;
}

const StockNews: React.FC<StockNewsProps> = ({
  symbol,
  news,
  loading = false,
  error = null,
  className = ''
}) => {
  if (loading) {
    return (
      <Card 
        title="Latest News" 
        className={`stock-news loading ${className}`}
      >
        <Loading text="Loading news..." />
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card 
        title="Latest News" 
        className={`stock-news error ${className}`}
      >
        <div className="error-message">
          <p>Error loading news: {error}</p>
        </div>
      </Card>
    );
  }
  
  if (!news || news.length === 0) {
    return (
      <Card 
        title="Latest News" 
        className={`stock-news empty ${className}`}
      >
        <div className="empty-state">
          <p>No recent news available for {symbol}.</p>
        </div>
      </Card>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const getSentimentClass = (sentiment?: 'positive' | 'negative' | 'neutral') => {
    if (!sentiment) return '';
    return `sentiment-${sentiment}`;
  };
  
  return (
    <Card 
      title="Latest News" 
      className={`stock-news ${className}`}
    >
      <div className="news-list">
        {news.map((item) => (
          <a 
            key={item.id} 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`news-item ${getSentimentClass(item.sentiment)}`}
          >
            <div className="news-content">
              <h3 className="news-title">{item.title}</h3>
              <p className="news-snippet">{item.snippet}</p>
              <div className="news-meta">
                <span className="news-source">{item.source}</span>
                <span className="news-date">{formatDate(item.publishedAt)}</span>
                
                {item.sentiment && (
                  <span className={`news-sentiment ${getSentimentClass(item.sentiment)}`}>
                    {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                    {item.sentimentScore !== undefined && ` (${item.sentimentScore.toFixed(1)})`}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </Card>
  );
};

export default StockNews;
