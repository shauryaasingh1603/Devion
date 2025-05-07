import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import Card from '../common/Card';
import Loading from '../common/Loading';

interface MarketOverviewProps {
  className?: string;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ className = '' }) => {
  const { marketData, loading, error } = useSelector((state: RootState) => state.portfolio);
  
  if (loading) {
    return <Loading text="Loading market data..." />;
  }
  
  if (error) {
    return (
      <Card 
        title="Market Overview" 
        className={`market-overview error ${className}`}
      >
        <div className="error-message">
          <p>Error loading market data: {error}</p>
        </div>
      </Card>
    );
  }
  
  if (!marketData) {
    return (
      <Card 
        title="Market Overview" 
        className={`market-overview empty ${className}`}
      >
        <div className="empty-state">
          <p>Market data is currently unavailable.</p>
        </div>
      </Card>
    );
  }
  
  const { indices, currencies, commodities } = marketData;
  
  const getChangeClass = (change: number) => {
    return change >= 0 ? 'positive' : 'negative';
  };
  
  const formatChange = (change: number) => {
    return change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
  };
  
  return (
    <Card 
      title="Market Overview" 
      className={`market-overview ${className}`}
    >
      <div className="market-sections">
        <div className="market-section">
          <h4>Major Indices</h4>
          <div className="market-items">
            {indices.slice(0, 4).map(index => (
              <div key={index.symbol} className="market-item">
                <div className="item-header">
                  <span className="item-name">{index.name}</span>
                  <span className={`item-change ${getChangeClass(index.changePercent)}`}>
                    {formatChange(index.changePercent)}
                  </span>
                </div>
                <div className="item-value">{index.currentPrice.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="market-section">
          <h4>Currencies</h4>
          <div className="market-items">
            {Object.values(currencies).slice(0, 3).map(currency => (
              <div key={currency.symbol} className="market-item">
                <div className="item-header">
                  <span className="item-name">{currency.name}</span>
                  <span className={`item-change ${getChangeClass(currency.changePercent)}`}>
                    {formatChange(currency.changePercent)}
                  </span>
                </div>
                <div className="item-value">{currency.rate.toFixed(4)}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="market-section">
          <h4>Commodities</h4>
          <div className="market-items">
            {Object.values(commodities).slice(0, 3).map(commodity => (
              <div key={commodity.symbol} className="market-item">
                <div className="item-header">
                  <span className="item-name">{commodity.name}</span>
                  <span className={`item-change ${getChangeClass(commodity.changePercent)}`}>
                    {formatChange(commodity.changePercent)}
                  </span>
                </div>
                <div className="item-value">${commodity.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MarketOverview;
