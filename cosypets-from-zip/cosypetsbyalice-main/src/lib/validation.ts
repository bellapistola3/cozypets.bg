export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  phone: (value: string): boolean => {
    const phoneRegex = /^(\+359|0)[0-9]{9}$/;
    return phoneRegex.test(value.replace(/\s/g, ''));
  },

  password: (value: string): boolean => {
    return value.length >= 6;
  },

  required: (value: string | number | null | undefined): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  positiveNumber: (value: number): boolean => {
    return value > 0;
  },

  dateInFuture: (date: string): boolean => {
    return new Date(date) > new Date();
  },

  dateRange: (startDate: string, endDate: string): boolean => {
    return new Date(startDate) < new Date(endDate);
  }
};

export const errorMessages = {
  required: 'Това поле е задължително',
  email: 'Моля, въведете валиден имейл адрес',
  phone: 'Моля, въведете валиден телефонен номер (формат: 0888123456)',
  password: 'Паролата трябва да е поне 6 символа',
  minLength: (min: number) => `Минимална дължина: ${min} символа`,
  maxLength: (max: number) => `Максимална дължина: ${max} символа`,
  positiveNumber: 'Стойността трябва да е положително число',
  dateInFuture: 'Датата трябва да е в бъдещето',
  dateRange: 'Началната дата трябва да е преди крайната',
};

export function validateField(
  value: any,
  rules: {
    required?: boolean;
    email?: boolean;
    phone?: boolean;
    password?: boolean;
    minLength?: number;
    maxLength?: number;
    positiveNumber?: boolean;
    dateInFuture?: boolean;
    custom?: (value: any) => boolean;
    customMessage?: string;
  }
): string | null {
  if (rules.required && !validators.required(value)) {
    return errorMessages.required;
  }

  if (!value) return null;

  if (rules.email && !validators.email(value)) {
    return errorMessages.email;
  }

  if (rules.phone && !validators.phone(value)) {
    return errorMessages.phone;
  }

  if (rules.password && !validators.password(value)) {
    return errorMessages.password;
  }

  if (rules.minLength && !validators.minLength(value, rules.minLength)) {
    return errorMessages.minLength(rules.minLength);
  }

  if (rules.maxLength && !validators.maxLength(value, rules.maxLength)) {
    return errorMessages.maxLength(rules.maxLength);
  }

  if (rules.positiveNumber && !validators.positiveNumber(value)) {
    return errorMessages.positiveNumber;
  }

  if (rules.dateInFuture && !validators.dateInFuture(value)) {
    return errorMessages.dateInFuture;
  }

  if (rules.custom && !rules.custom(value)) {
    return rules.customMessage || 'Невалидна стойност';
  }

  return null;
}

export function validateForm<T extends Record<string, any>>(
  values: T,
  rules: Record<keyof T, any>
): ValidationResult {
  const errors: Record<string, string> = {};

  for (const field in rules) {
    const error = validateField(values[field], rules[field]);
    if (error) {
      errors[field] = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
