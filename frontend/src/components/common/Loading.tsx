import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  type?: 'spinner' | 'dots' | 'pulse';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  type = 'spinner',
  text,
  fullScreen = false,
  className = ''
}) => {
  const loadingClass = `loading loading-${type} loading-${size} ${fullScreen ? 'loading-fullscreen' : ''} ${className}`.trim();
  
  return (
    <div className={loadingClass}>
      <div className="loading-indicator">
        {type === 'spinner' && (
          <div className="spinner"></div>
        )}
        
        {type === 'dots' && (
          <div className="dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}
        
        {type === 'pulse' && (
          <div className="pulse"></div>
        )}
      </div>
      
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default Loading;
