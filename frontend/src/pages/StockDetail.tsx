import React from 'react';
import { useParams } from 'react-router-dom';

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();

  return (
    <div className="stock-detail-page">
      <header className="container">
        <h1>{symbol}</h1>
        <div className="stock-header-info">
          <span className="price">₹2,456.75</span>
          <span className="change negative">-1.2%</span>
        </div>
      </header>
      
      <main className="container">
        <div className="stock-detail-grid">
          <div className="card price-chart">
            <h2>Price Chart</h2>
            <div className="chart-container">
              {/* Chart will be implemented with Chart.js */}
              <div className="chart-placeholder">
                Price chart will be displayed here
              </div>
            </div>
          </div>
          
          <div className="card risk-analysis">
            <h2>Risk Analysis</h2>
            <div className="risk-score">
              <span className="score">78</span>
              <span className="label">High Risk</span>
            </div>
            <div className="risk-factors">
              <h3>Risk Factors</h3>
              <ul>
                <li className="high">Unusual institutional selling detected</li>
                <li className="medium">Approaching technical resistance level</li>
                <li className="low">Slight increase in volatility</li>
              </ul>
            </div>
          </div>
          
          <div className="card technical-indicators">
            <h2>Technical Indicators</h2>
            <div className="indicators-grid">
              <div className="indicator">
                <span className="label">RSI</span>
                <span className="value">72.5</span>
                <span className="interpretation negative">Overbought</span>
              </div>
              <div className="indicator">
                <span className="label">MACD</span>
                <span className="value">-0.35</span>
                <span className="interpretation negative">Bearish</span>
              </div>
              <div className="indicator">
                <span className="label">Moving Avg (50)</span>
                <span className="value">₹2,345.60</span>
                <span className="interpretation positive">Above</span>
              </div>
              <div className="indicator">
                <span className="label">Moving Avg (200)</span>
                <span className="value">₹2,210.30</span>
                <span className="interpretation positive">Above</span>
              </div>
            </div>
          </div>
          
          <div className="card news-sentiment">
            <h2>News Sentiment</h2>
            <div className="sentiment-score">
              <span className="score negative">-0.6</span>
              <span className="label">Negative</span>
            </div>
            <div className="news-items">
              <div className="news-item">
                <h3>Quarterly Results Below Expectations</h3>
                <p>The company reported earnings below analyst expectations...</p>
                <span className="source">Economic Times - 2 hours ago</span>
              </div>
              <div className="news-item">
                <h3>Regulatory Challenges Ahead</h3>
                <p>New regulations could impact the company's operations...</p>
                <span className="source">Business Standard - 5 hours ago</span>
              </div>
            </div>
          </div>
          
          <div className="card institutional-activity">
            <h2>Institutional Activity</h2>
            <div className="activity-summary">
              <span className="label">Net Activity (7 days)</span>
              <span className="value negative">-2.3%</span>
            </div>
            <div className="activity-chart">
              {/* Chart will be implemented with Chart.js */}
              <div className="chart-placeholder">
                Institutional activity chart will be displayed here
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StockDetail;
