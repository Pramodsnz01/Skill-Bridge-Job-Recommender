import React from 'react';
import { forwardRef } from 'react';

const FormField = forwardRef(({
  label,
  error,
  help,
  required = false,
  disabled = false,
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {children}
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      {help && !error && (
        <p className="form-help">
          {help}
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

// Input component
const Input = forwardRef(({
  type = 'text',
  error = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const classes = [
    'form-field',
    error ? 'error' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <input
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled}
      {...props}
    />
  );
});

Input.displayName = 'Input';

// Textarea component
const Textarea = forwardRef(({
  error = false,
  disabled = false,
  rows = 4,
  className = '',
  ...props
}, ref) => {
  const classes = [
    'form-field resize-none',
    error ? 'error' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <textarea
      ref={ref}
      className={classes}
      rows={rows}
      disabled={disabled}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

// Select component
const Select = forwardRef(({
  error = false,
  disabled = false,
  className = '',
  children,
  ...props
}, ref) => {
  const classes = [
    'form-field appearance-none bg-no-repeat',
    error ? 'error' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="relative">
      <select
        ref={ref}
        className={classes}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem'
        }}
        disabled={disabled}
        {...props}
      >
        {children}
      </select>
    </div>
  );
});

Select.displayName = 'Select';

// Checkbox component
const Checkbox = forwardRef(({
  label,
  error = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <label className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <input
        ref={ref}
        type="checkbox"
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        disabled={disabled}
        {...props}
      />
      {label && (
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

// Radio component
const Radio = forwardRef(({
  label,
  error = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <label className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <input
        ref={ref}
        type="radio"
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        disabled={disabled}
        {...props}
      />
      {label && (
        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
    </label>
  );
});

Radio.displayName = 'Radio';

// Attach components to FormField
FormField.Input = Input;
FormField.Textarea = Textarea;
FormField.Select = Select;
FormField.Checkbox = Checkbox;
FormField.Radio = Radio;

export default FormField; 