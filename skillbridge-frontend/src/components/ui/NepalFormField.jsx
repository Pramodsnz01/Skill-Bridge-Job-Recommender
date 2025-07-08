import React, { useState, useEffect } from 'react';
import { 
  validateNepaliPhone, 
  formatNepaliPhone, 
  nepalProvinces, 
  getDistrictsByProvince,
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
  districts: propDistricts,
  ...props 
}) => {
  const [localValue, setLocalValue] = useState(value || '');
  const [isValid, setIsValid] = useState(true);
  const [districts, setDistricts] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  useEffect(() => {
    if (name === 'province' && localValue) {
      setDistricts(getDistrictsByProvince(localValue));
    }
  }, [localValue, name]);

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
            placeholder="98xxxxxxxx"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
              !isValid ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            {...props}
          />
        );

      case 'currency':
        return (
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">
              Rs.
            </span>
            <input
              type="text"
              name={name}
              value={localValue}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full pl-12 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              {...props}
            />
          </div>
        );

      case 'province':
        return (
          <select
            name={name}
            value={localValue}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            {...props}
          >
            <option value="">Select Province</option>
            {nepalProvinces.map(province => (
              <option key={province.value} value={province.value}>
                {province.label}
              </option>
            ))}
          </select>
        );

      case 'district':
        const districtOptions = propDistricts && propDistricts.length ? propDistricts : districts;
        return (
          <select
            name={name}
            value={localValue}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            disabled={!districtOptions.length}
            {...props}
          >
            <option value="">Select District</option>
            {districtOptions.map(district => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
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

      case 'password':
        return (
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name={name}
              value={localValue}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 pr-10"
              {...props}
            />
            <span
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500 dark:text-gray-400"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={0}
              role="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                // Eye-off SVG
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.221 1.125-4.575m1.664-2.09A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 2.21-.715 4.25-1.925 5.925M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              ) : (
                // Eye SVG
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </span>
          </div>
        );

      default:
        return (
          <input
            type={type}
            name={name}
            value={localValue}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            {...props}
          />
        );
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {renderField()}
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      
      {type === 'phone' && !isValid && localValue && (
        <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
          Please enter a valid Nepali phone number (e.g., 98xxxxxxxx)
        </p>
      )}
      
      {type === 'currency' && localValue && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Formatted: {formatToNepaliRupees(parseCurrencyInput(localValue))}
        </p>
      )}
    </div>
  );
};

export default NepalFormField; 