import React, { useState, useEffect } from 'react';

interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  message: string;
  dismissible?: boolean;
  autoClose?: boolean;
  autoCloseTime?: number;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  dismissible = true,
  autoClose = false,
  autoCloseTime = 5000,
  onClose,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (autoClose && isVisible) {
      timer = setTimeout(() => {
        handleClose();
      }, autoCloseTime);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoClose, autoCloseTime, isVisible]);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  if (!isVisible) return null;
  
  const alertClass = `alert alert-${type} ${className}`.trim();
  
  return (
    <div className={alertClass} role="alert">
      <div className="alert-content">
        {title && <h4 className="alert-title">{title}</h4>}
        <p className="alert-message">{message}</p>
      </div>
      
      {dismissible && (
        <button 
          className="alert-close" 
          onClick={handleClose}
          aria-label="Close alert"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
