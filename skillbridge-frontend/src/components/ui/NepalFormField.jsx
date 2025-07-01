import React, { useState, useEffect } from 'react';
import { 
  validateNepaliPhone, 
  formatNepaliPhone, 
  nepalProvinces, 
  getDistrictsByProvince,
  getMunicipalitiesByDistrict,
  getMunicipalitiesByProvince,
  formatToNepaliRupees,
  formatCurrencyInput,
  parseCurrencyInput
} from '../../utils/nepalLocalization';

const NepalFormField = ({ 
  type = 'text',
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  className = '',
  options = [],
  loading = false,
  ...props 
}) => {
  const [localValue, setLocalValue] = useState(value || '');
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    let newValue = e.target.value;
    
    // Special handling for different field types
    if (type === 'phone') {
      // Format phone number as user types
      const cleanValue = newValue.replace(/[\s\-\(\)]/g, '');
      if (cleanValue.length <= 10) {
        newValue = cleanValue;
      } else {
        return; // Don't allow more than 10 digits
      }
    } else if (type === 'currency') {
      // Format currency input
      newValue = formatCurrencyInput(newValue);
    }
    
    setLocalValue(newValue);
    
    // Validate phone numbers
    if (type === 'phone' && newValue) {
      const phoneValid = validateNepaliPhone(newValue);
      setIsValid(phoneValid);
    } else {
      setIsValid(true);
    }
    
    // Call parent onChange
    if (onChange) {
      onChange({
        target: {
          name,
          value: type === 'currency' ? parseCurrencyInput(newValue) : newValue
        }
      });
    }
  };

  const handleBlur = () => {
    if (type === 'phone' && localValue) {
      const formatted = formatNepaliPhone(localValue);
      setLocalValue(formatted);
      if (onChange) {
        onChange({
          target: {
            name,
            value: formatted
          }
        });
      }
    }
  };

  const renderField = () => {
    switch (type) {
      case 'phone':
        return (
          <input
            type="tel"
            name={name}
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder || "Enter phone number"}
            className={`w-full px-3 py-2 border ${isValid ? 'border-gray-300 dark:border-gray-600' : 'border-red-500'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${className}`}
            {...props}
          />
        );

      case 'currency':
        return (
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              Rs.
            </span>
            <input
              type="text"
              name={name}
              value={localValue}
              onChange={handleChange}
              placeholder={placeholder || "0.00"}
              className={`w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${className}`}
              {...props}
            />
          </div>
        );

      case 'province':
      case 'district':
      case 'municipality':
        return (
          <div className="relative">
            <select
              name={name}
              value={localValue}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              disabled={props.disabled || loading || !options.length}
              {...props}
            >
              <option value="">Select {label}</option>
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="animate-spin h-4 w-4 text-blue-500" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v2a6 6 0 100 12v2a8 8 0 01-8-8z" />
                </svg>
              </div>
            )}
          </div>
        );

      case 'textarea':
        return (
          <textarea
            name={name}
            value={localValue}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            rows={4}
            {...props}
          />
        );

      default:
        return (
          <input
            type={type}
            name={name}
            value={localValue}
            onChange={handleChange}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${className}`}
            {...props}
          />
        );
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {type === 'phone' && localValue && !isValid && (
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          Please enter a valid Nepali phone number
        </p>
      )}
      {type === 'currency' && localValue && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Formatted: {formatToNepaliRupees(parseCurrencyInput(localValue))}
        </p>
      )}
    </div>
  );
};

export default NepalFormField; 