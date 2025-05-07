import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';

interface WatchlistItemProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  riskScore?: number;
  onRemove?: () => void;
  className?: string;
}

const WatchlistItem: React.FC<WatchlistItemProps> = ({
  symbol,
  name,
  price,
  change,
  changePercent,
  riskScore,
  onRemove,
  className = ''
}) => {
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
    <Card 
      className={`watchlist-item ${changeClass} ${riskClass} ${className}`}
      hoverable
    >
      <Link to={`/stock/${symbol}`} className="watchlist-item-content">
        <div className="stock-info">
          <div className="stock-symbol">{symbol}</div>
          <div className="stock-name">{name}</div>
        </div>
        
        <div className="stock-price">
          <div className="price-value">₹{price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <div className={`price-change ${changeClass}`}>
            {isPositive ? '+' : ''}{change.toLocaleString(undefined, { maximumFractionDigits: 2 })} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
          </div>
        </div>
        
        {riskScore !== undefined && (
          <div className={`risk-indicator ${riskClass}`}>
            <div className="risk-score">{riskScore}</div>
            <div className="risk-label">Risk</div>
          </div>
        )}
      </Link>
      
      {onRemove && (
        <button 
          className="remove-button" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          aria-label={`Remove ${symbol} from watchlist`}
        >
          &times;
        </button>
      )}
    </Card>
  );
};

export default WatchlistItem;
