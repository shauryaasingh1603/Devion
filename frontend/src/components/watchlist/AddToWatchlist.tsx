import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { addToWatchlist } from '../../store/slices/watchlistSlice';
import Button from '../common/Button';
import Alert from '../common/Alert';

interface AddToWatchlistProps {
  onSuccess?: () => void;
  className?: string;
}

const AddToWatchlist: React.FC<AddToWatchlistProps> = ({
  onSuccess,
  className = ''
}) => {
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symbol.trim()) {
      setError('Please enter a stock symbol');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const formattedSymbol = symbol.toUpperCase().trim();
      
      await dispatch(addToWatchlist(formattedSymbol)).unwrap();
      
      setSymbol('');
      setSuccess(`${formattedSymbol} added to watchlist`);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add stock to watchlist');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={`add-to-watchlist ${className}`}>
      <form onSubmit={handleSubmit} className="watchlist-form">
        <div className="form-group">
          <label htmlFor="stock-symbol">Add Stock to Watchlist</label>
          <div className="input-group">
            <input
              id="stock-symbol"
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Enter stock symbol (e.g., RELIANCE)"
              disabled={loading}
            />
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              disabled={loading}
            >
              Add
            </Button>
          </div>
        </div>
      </form>
      
      {error && (
        <Alert
          type="danger"
          message={error}
          dismissible
          onClose={() => setError(null)}
        />
      )}
      
      {success && (
        <Alert
          type="success"
          message={success}
          dismissible
          autoClose
          onClose={() => setSuccess(null)}
        />
      )}
    </div>
  );
};

export default AddToWatchlist;
