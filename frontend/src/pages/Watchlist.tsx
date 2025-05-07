import React from 'react';

const Watchlist: React.FC = () => {
  return (
    <div className="watchlist-page">
      <header className="container">
        <h1>Watchlist</h1>
        <p>Monitor stocks you're interested in</p>
      </header>
      
      <main className="container">
        <div className="watchlist-controls">
          <input type="text" placeholder="Add stock to watchlist..." />
          <button className="primary">Add</button>
        </div>
        
        <div className="watchlist-table">
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Price</th>
                <th>Change</th>
                <th>Risk Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>RELIANCE</td>
                <td>Reliance Industries Ltd.</td>
                <td>₹2,456.75</td>
                <td className="negative">-1.2%</td>
                <td className="high-risk">78</td>
                <td>
                  <button className="secondary">View</button>
                  <button className="danger">Remove</button>
                </td>
              </tr>
              <tr>
                <td>TCS</td>
                <td>Tata Consultancy Services Ltd.</td>
                <td>₹3,567.80</td>
                <td className="positive">+0.8%</td>
                <td className="low-risk">32</td>
                <td>
                  <button className="secondary">View</button>
                  <button className="danger">Remove</button>
                </td>
              </tr>
              <tr>
                <td>INFY</td>
                <td>Infosys Ltd.</td>
                <td>₹1,432.60</td>
                <td className="negative">-0.5%</td>
                <td className="medium-risk">56</td>
                <td>
                  <button className="secondary">View</button>
                  <button className="danger">Remove</button>
                </td>
              </tr>
              <tr>
                <td>HDFCBANK</td>
                <td>HDFC Bank Ltd.</td>
                <td>₹1,678.25</td>
                <td className="positive">+1.3%</td>
                <td className="low-risk">28</td>
                <td>
                  <button className="secondary">View</button>
                  <button className="danger">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Watchlist;
