import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...rest
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const widthClass = fullWidth ? 'btn-full-width' : '';
  const loadingClass = isLoading ? 'btn-loading' : '';
  const iconClass = icon ? `btn-with-icon btn-icon-${iconPosition}` : '';
  
  const combinedClassName = `${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${loadingClass} ${iconClass} ${className}`.trim();
  
  return (
    <button 
      className={combinedClassName} 
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <span className="btn-spinner"></span>
      )}
      
      {icon && iconPosition === 'left' && !isLoading && (
        <span className="btn-icon">{icon}</span>
      )}
      
      <span className="btn-text">{children}</span>
      
      {icon && iconPosition === 'right' && !isLoading && (
        <span className="btn-icon">{icon}</span>
      )}
    </button>
  );
};

export default Button;
