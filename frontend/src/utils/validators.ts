/**
 * Utility functions for form validation
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phoneNumber.replace(/\D/g, ''));
};

export const validateStockSymbol = (symbol: string): boolean => {
  const symbolRegex = /^[A-Z0-9._]{1,20}$/;
  return symbolRegex.test(symbol);
};

export const validateRequired = (value: string): boolean => {
  return value.trim() !== '';
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validateNumber = (value: string): boolean => {
  return !isNaN(Number(value));
};

export const validateInteger = (value: string): boolean => {
  return Number.isInteger(Number(value));
};

export const validatePositiveNumber = (value: string): boolean => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

export const validateRange = (value: string, min: number, max: number): boolean => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export const validateDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateForm = (
  formData: Record<string, string>,
  validationRules: Record<string, Array<(value: string) => boolean | string>>
): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    errors: {}
  };
  
  Object.keys(validationRules).forEach(field => {
    const value = formData[field] || '';
    const rules = validationRules[field];
    
    for (const rule of rules) {
      const ruleResult = rule(value);
      
      if (typeof ruleResult === 'string') {
        result.isValid = false;
        result.errors[field] = ruleResult;
        break;
      } else if (ruleResult === false) {
        result.isValid = false;
        result.errors[field] = `Invalid ${field}`;
        break;
      }
    }
  });
  
  return result;
};

export const createRequiredRule = (fieldName: string) => {
  return (value: string): boolean | string => {
    return validateRequired(value) || `${fieldName} is required`;
  };
};

export const createEmailRule = () => {
  return (value: string): boolean | string => {
    return validateEmail(value) || 'Invalid email format';
  };
};

export const createPasswordRule = () => {
  return (value: string): boolean | string => {
    return validatePassword(value) || 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
  };
};

export const createMinLengthRule = (minLength: number, fieldName: string) => {
  return (value: string): boolean | string => {
    return validateMinLength(value, minLength) || `${fieldName} must be at least ${minLength} characters`;
  };
};

export const createMaxLengthRule = (maxLength: number, fieldName: string) => {
  return (value: string): boolean | string => {
    return validateMaxLength(value, maxLength) || `${fieldName} must be at most ${maxLength} characters`;
  };
};
