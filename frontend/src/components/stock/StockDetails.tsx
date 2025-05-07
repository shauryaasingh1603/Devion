import React from 'react';
import Card from '../common/Card';

interface StockDetailsProps {
  symbol: string;
  details: {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    marketCap?: number;
    peRatio?: number;
    eps?: number;
    dividend?: number;
    dividendYield?: number;
    high52Week?: number;
    low52Week?: number;
  };
  className?: string;
}

const StockDetails: React.FC<StockDetailsProps> = ({
  symbol,
  details,
  className = ''
}) => {
  return (
    <Card 
      title="Stock Details" 
      className={`stock-details ${className}`}
    >
      <div className="details-grid">
        <div className="detail-item">
          <span className="detail-label">Open</span>
          <span className="detail-value">₹{details.open.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">High</span>
          <span className="detail-value">₹{details.high.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Low</span>
          <span className="detail-value">₹{details.low.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Close</span>
          <span className="detail-value">₹{details.close.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-label">Volume</span>
          <span className="detail-value">{details.volume.toLocaleString()}</span>
        </div>
        
        {details.marketCap !== undefined && (
          <div className="detail-item">
            <span className="detail-label">Market Cap</span>
            <span className="detail-value">₹{details.marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
        )}
        
        {details.peRatio !== undefined && (
          <div className="detail-item">
            <span className="detail-label">P/E Ratio</span>
            <span className="detail-value">{details.peRatio.toFixed(2)}</span>
          </div>
        )}
        
        {details.eps !== undefined && (
          <div className="detail-item">
            <span className="detail-label">EPS</span>
            <span className="detail-value">₹{details.eps.toFixed(2)}</span>
          </div>
        )}
        
        {details.dividend !== undefined && (
          <div className="detail-item">
            <span className="detail-label">Dividend</span>
            <span className="detail-value">₹{details.dividend.toFixed(2)}</span>
          </div>
        )}
        
        {details.dividendYield !== undefined && (
          <div className="detail-item">
            <span className="detail-label">Dividend Yield</span>
            <span className="detail-value">{details.dividendYield.toFixed(2)}%</span>
          </div>
        )}
        
        {details.high52Week !== undefined && (
          <div className="detail-item">
            <span className="detail-label">52 Week High</span>
            <span className="detail-value">₹{details.high52Week.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
        )}
        
        {details.low52Week !== undefined && (
          <div className="detail-item">
            <span className="detail-label">52 Week Low</span>
            <span className="detail-value">₹{details.low52Week.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StockDetails;
