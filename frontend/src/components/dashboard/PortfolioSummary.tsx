import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Card from '../common/Card';
import Loading from '../common/Loading';

interface PortfolioSummaryProps {
  className?: string;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ className = '' }) => {
  const { portfolio, loading, error } = useSelector((state: RootState) => state.portfolio);
  
  if (loading) {
    return <Loading text="Loading portfolio data..." />;
  }
  
  if (error) {
    return (
      <Card 
        title="Portfolio Summary" 
        className={`portfolio-summary error ${className}`}
      >
        <div className="error-message">
          <p>Error loading portfolio data: {error}</p>
        </div>
      </Card>
    );
  }
  
  if (!portfolio || portfolio.stocks.length === 0) {
    return (
      <Card 
        title="Portfolio Summary" 
        className={`portfolio-summary empty ${className}`}
      >
        <div className="empty-state">
          <p>You don't have any stocks in your portfolio yet.</p>
          <button className="btn btn-primary">Add Stocks</button>
        </div>
      </Card>
    );
  }
  
  const totalValue = portfolio.stocks.reduce((sum, stock) => sum + stock.value, 0);
  const totalInvestment = portfolio.stocks.reduce((sum, stock) => sum + stock.investmentValue, 0);
  const totalGain = totalValue - totalInvestment;
  const totalGainPercentage = (totalGain / totalInvestment) * 100;
  
  const sortedStocks = [...portfolio.stocks].sort((a, b) => b.changePercent - a.changePercent);
  const topGainers = sortedStocks.slice(0, 3);
  const topLosers = sortedStocks.slice(-3).reverse();
  
  return (
    <Card 
      title="Portfolio Summary" 
      className={`portfolio-summary ${className}`}
    >
      <div className="portfolio-metrics">
        <div className="metric">
          <span className="metric-label">Total Value</span>
          <span className="metric-value">₹{totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
        
        <div className="metric">
          <span className="metric-label">Total Investment</span>
          <span className="metric-value">₹{totalInvestment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
        
        <div className={`metric ${totalGain >= 0 ? 'positive' : 'negative'}`}>
          <span className="metric-label">Total Gain/Loss</span>
          <span className="metric-value">
            ₹{Math.abs(totalGain).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            ({totalGainPercentage.toFixed(2)}%)
          </span>
        </div>
      </div>
      
      <div className="portfolio-performance">
        <div className="top-performers">
          <h4>Top Gainers</h4>
          <ul className="stock-list">
            {topGainers.map(stock => (
              <li key={stock.symbol} className="stock-item positive">
                <span className="stock-symbol">{stock.symbol}</span>
                <span className="stock-name">{stock.name}</span>
                <span className="stock-change">+{stock.changePercent.toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bottom-performers">
          <h4>Top Losers</h4>
          <ul className="stock-list">
            {topLosers.map(stock => (
              <li key={stock.symbol} className="stock-item negative">
                <span className="stock-symbol">{stock.symbol}</span>
                <span className="stock-name">{stock.name}</span>
                <span className="stock-change">-{Math.abs(stock.changePercent).toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default PortfolioSummary;
