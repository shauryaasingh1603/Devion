import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <div className="landing-page">
      <header className="container">
        <div className="header-content">
          <h1>Kuber</h1>
          <p>AI-powered capital protection platform for NSE investors</p>
          <div className="cta-buttons">
            <Link to="/dashboard">
              <button className="primary">Get Started</button>
            </Link>
            <Link to="/subscription">
              <button className="secondary">View Plans</button>
            </Link>
          </div>
        </div>
      </header>
      
      <section className="features container">
        <h2>Key Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Risk Radar</h3>
            <p>Continuously scans technical, sentiment, institutional, and macro-political dimensions for threats to your portfolio.</p>
          </div>
          <div className="feature-card">
            <h3>AI-Powered Insights</h3>
            <p>Leverages Claude to generate natural language insights and risk scores.</p>
          </div>
          <div className="feature-card">
            <h3>Real-Time Monitoring</h3>
            <p>Fetches live data from multiple sources to provide up-to-date information.</p>
          </div>
          <div className="feature-card">
            <h3>Preservation Focus</h3>
            <p>Prioritizes capital preservation over prediction, alerting you before risk events unfold.</p>
          </div>
        </div>
      </section>
      
      <footer className="container">
        <p>&copy; {new Date().getFullYear()} Kuber. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
