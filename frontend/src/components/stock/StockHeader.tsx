import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface StockHeaderProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  riskScore?: number;
  className?: string;
}

const StockHeader: React.FC<StockHeaderProps> = ({
  symbol,
  name,
  price,
  change,
  changePercent,
  riskScore,
  className = ''
}) => {
  const { watchlist } = useSelector((state: RootState) => state.watchlist);
  const isInWatchlist = watchlist.some(item => item.symbol === symbol);
  
  const isPositive = changePercent >= 0;
  const changeClass = isPositive ? 'positive' : 'negative';
  
  const getRiskColor = (score?: number) => {
    if (score === undefined) return '';
    if (score >= 70) return 'high-risk';
    if (score >= 40) return 'medium-risk';
    return 'low-risk';
  };
  
  const riskClass = getRiskColor(riskScore);
  
  return (
    <div className={`stock-header ${changeClass} ${riskClass} ${className}`}>
      <div className="stock-header-main">
        <div className="stock-identity">
          <h1 className="stock-symbol">{symbol}</h1>
          <h2 className="stock-name">{name}</h2>
          
          {isInWatchlist && (
            <span className="watchlist-badge">
              In Watchlist
            </span>
          )}
        </div>
        
        <div className="stock-price-container">
          <div className="current-price">₹{price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div className={`price-change ${changeClass}`}>
            {isPositive ? '+' : ''}{change.toLocaleString(undefined, { maximumFractionDigits: 2 })} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>
      
      {riskScore !== undefined && (
        <div className="stock-risk">
          <div className={`risk-indicator ${riskClass}`}>
            <span className="risk-label">Risk Score:</span>
            <span className="risk-value">{riskScore}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockHeader;
