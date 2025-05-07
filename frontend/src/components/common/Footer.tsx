import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>Kuber</h2>
            <p>AI-Powered Risk Protection for NSE Investors</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-section">
              <h3>Platform</h3>
              <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/watchlist">Watchlist</Link></li>
                <li><Link to="/subscription">Subscription</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Resources</h3>
              <ul>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/support">Support</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Legal</h3>
              <ul>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/disclaimer">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} Kuber. All rights reserved.</p>
          <p className="disclaimer">
            Kuber is not a registered investment advisor. All investment strategies and investments involve risk of loss.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
