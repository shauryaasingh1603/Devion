import React from 'react';

const Subscription: React.FC = () => {
  return (
    <div className="subscription-page">
      <header className="container">
        <h1>Subscription Plans</h1>
        <p>Choose the right plan for your investment needs</p>
      </header>
      
      <main className="container">
        <div className="subscription-plans">
          <div className="plan-card">
            <div className="plan-header">
              <h2>Basic</h2>
              <p className="price">₹499<span>/month</span></p>
            </div>
            <div className="plan-features">
              <ul>
                <li>Portfolio risk monitoring</li>
                <li>Basic technical analysis</li>
                <li>Daily risk summary</li>
                <li>Email alerts</li>
                <li>Up to 10 stocks in watchlist</li>
              </ul>
            </div>
            <div className="plan-action">
              <button className="secondary">Select Plan</button>
            </div>
          </div>
          
          <div className="plan-card featured">
            <div className="plan-badge">Most Popular</div>
            <div className="plan-header">
              <h2>Pro</h2>
              <p className="price">₹999<span>/month</span></p>
            </div>
            <div className="plan-features">
              <ul>
                <li>All Basic features</li>
                <li>Advanced technical analysis</li>
                <li>Sentiment analysis</li>
                <li>Institutional activity tracking</li>
                <li>Push notifications</li>
                <li>Up to 30 stocks in watchlist</li>
                <li>Weekly detailed risk report</li>
              </ul>
            </div>
            <div className="plan-action">
              <button className="primary">Select Plan</button>
            </div>
          </div>
          
          <div className="plan-card">
            <div className="plan-header">
              <h2>Enterprise</h2>
              <p className="price">₹2,499<span>/month</span></p>
            </div>
            <div className="plan-features">
              <ul>
                <li>All Pro features</li>
                <li>Unlimited stocks in watchlist</li>
                <li>Custom risk models</li>
                <li>API access</li>
                <li>Priority support</li>
                <li>Multi-user access</li>
                <li>Custom integrations</li>
              </ul>
            </div>
            <div className="plan-action">
              <button className="secondary">Contact Sales</button>
            </div>
          </div>
        </div>
        
        <div className="subscription-faq">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-item">
            <h3>Can I change my plan later?</h3>
            <p>Yes, you can upgrade or downgrade your plan at any time. Changes will be effective from the next billing cycle.</p>
          </div>
          <div className="faq-item">
            <h3>Is there a free trial?</h3>
            <p>Yes, all plans come with a 14-day free trial. No credit card required to start.</p>
          </div>
          <div className="faq-item">
            <h3>How accurate are the risk predictions?</h3>
            <p>Kuber focuses on identifying potential risks rather than making price predictions. Our risk models are continuously improved based on market data and user feedback.</p>
          </div>
          <div className="faq-item">
            <h3>Can I cancel my subscription?</h3>
            <p>Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Subscription;
