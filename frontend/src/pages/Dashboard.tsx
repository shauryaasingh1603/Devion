import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-page">
      <header className="container">
        <h1>Dashboard</h1>
        <p>Your portfolio risk overview</p>
      </header>
      
      <main className="container">
        <div className="dashboard-grid">
          <div className="card risk-summary">
            <h2>Risk Summary</h2>
            <div className="risk-score">
              <span className="score">65</span>
              <span className="label">Moderate Risk</span>
            </div>
            <p>Your portfolio has moderate risk exposure. Consider reviewing highlighted stocks.</p>
          </div>
          
          <div className="card portfolio-overview">
            <h2>Portfolio Overview</h2>
            <div className="portfolio-stats">
              <div className="stat">
                <span className="value">₹1,25,000</span>
                <span className="label">Total Value</span>
              </div>
              <div className="stat">
                <span className="value">-2.3%</span>
                <span className="label">Today's Change</span>
              </div>
              <div className="stat">
                <span className="value">+8.7%</span>
                <span className="label">Overall Return</span>
              </div>
            </div>
          </div>
          
          <div className="card risk-alerts">
            <h2>Risk Alerts</h2>
            <ul className="alert-list">
              <li className="alert high">
                <span className="stock">RELIANCE</span>
                <span className="message">Unusual institutional selling detected</span>
              </li>
              <li className="alert medium">
                <span className="stock">INFY</span>
                <span className="message">Negative sentiment in recent news</span>
              </li>
              <li className="alert low">
                <span className="stock">HDFCBANK</span>
                <span className="message">Approaching technical resistance level</span>
              </li>
            </ul>
          </div>
          
          <div className="card market-insights">
            <h2>Market Insights</h2>
            <p>Market volatility has increased due to recent policy announcements. Consider reducing exposure to rate-sensitive sectors.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
