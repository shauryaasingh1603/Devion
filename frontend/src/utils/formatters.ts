/**
 * Utility functions for formatting data
 */

export const formatCurrency = (value: number, currency = 'INR', locale = 'en-IN'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const formatNumber = (value: number, minimumFractionDigits = 0, maximumFractionDigits = 2): string => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits,
    maximumFractionDigits
  }).format(value);
};

export const formatPercentage = (value: number, minimumFractionDigits = 2, maximumFractionDigits = 2): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits
  }).format(value / 100);
};

export const formatDate = (date: Date | number | string, format = 'full'): string => {
  const dateObj = typeof date === 'object' ? date : new Date(date);
  
  switch (format) {
    case 'full':
      return dateObj.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    case 'short':
      return dateObj.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    case 'time':
      return dateObj.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    case 'datetime':
      return dateObj.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    case 'relative':
      return formatRelativeTime(dateObj);
    default:
      return dateObj.toLocaleDateString('en-IN');
  }
};

export const formatRelativeTime = (date: Date | number | string): string => {
  const dateObj = typeof date === 'object' ? date : new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);
  
  if (diffSec < 60) {
    return 'just now';
  } else if (diffMin < 60) {
    return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffDay < 30) {
    return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
  } else if (diffMonth < 12) {
    return `${diffMonth} ${diffMonth === 1 ? 'month' : 'months'} ago`;
  } else {
    return `${diffYear} ${diffYear === 1 ? 'year' : 'years'} ago`;
  }
};

export const formatStockSymbol = (symbol: string): string => {
  return symbol.toUpperCase().replace('.NS', '');
};

export const formatLargeNumber = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  } else {
    return value.toString();
  }
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  
  return phoneNumber;
};

export const formatRiskScore = (score: number): { value: string; class: string } => {
  if (score >= 70) {
    return { value: score.toString(), class: 'high-risk' };
  } else if (score >= 40) {
    return { value: score.toString(), class: 'medium-risk' };
  } else {
    return { value: score.toString(), class: 'low-risk' };
  }
};

export const formatChange = (change: number): { value: string; class: string } => {
  const isPositive = change >= 0;
  const changeClass = isPositive ? 'positive' : 'negative';
  const changeValue = isPositive ? `+${change.toFixed(2)}` : change.toFixed(2);
  
  return { value: changeValue, class: changeClass };
};

export const formatChangePercent = (changePercent: number): { value: string; class: string } => {
  const isPositive = changePercent >= 0;
  const changeClass = isPositive ? 'positive' : 'negative';
  const changeValue = isPositive ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`;
  
  return { value: changeValue, class: changeClass };
};
