import React, { useEffect, useState, useRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export function Input({ label, hint, error, required, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  const [isShaking, setIsShaking] = useState(false);
  const prevError = useRef(error);

  useEffect(() => {
    if (error && !prevError.current) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 280); // Matches transitions.dev shake total duration (280ms)
      return () => clearTimeout(timer);
    }
    prevError.current = error;
  }, [error]);

  return (
    <div className={`form-group t-input-wrap ${error ? 'is-error' : ''}`}>
      {label && (
        <label htmlFor={inputId} className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`form-input t-input ${error ? 'is-error' : ''} ${isShaking ? 'is-shaking' : ''} ${className}`}
        {...props}
      />
      {hint && !error && <span className="form-hint">{hint}</span>}
      {error && <span className="form-error t-error-msg">{error}</span>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export function Textarea({ label, hint, error, required, className = '', id, ...props }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  const [isShaking, setIsShaking] = useState(false);
  const prevError = useRef(error);

  useEffect(() => {
    if (error && !prevError.current) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 280);
      return () => clearTimeout(timer);
    }
    prevError.current = error;
  }, [error]);

  return (
    <div className={`form-group t-input-wrap ${error ? 'is-error' : ''}`}>
      {label && (
        <label htmlFor={inputId} className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`form-textarea t-input ${error ? 'is-error' : ''} ${isShaking ? 'is-shaking' : ''} ${className}`}
        {...props}
      />
      {hint && !error && <span className="form-hint">{hint}</span>}
      {error && <span className="form-error t-error-msg">{error}</span>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ label, hint, error, required, options, placeholder, className = '', id, ...props }: SelectProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  const [isShaking, setIsShaking] = useState(false);
  const prevError = useRef(error);

  useEffect(() => {
    if (error && !prevError.current) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 280);
      return () => clearTimeout(timer);
    }
    prevError.current = error;
  }, [error]);

  return (
    <div className={`form-group t-input-wrap ${error ? 'is-error' : ''}`}>
      {label && (
        <label htmlFor={inputId} className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`form-select t-input ${error ? 'is-error' : ''} ${isShaking ? 'is-shaking' : ''} ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {hint && !error && <span className="form-hint">{hint}</span>}
      {error && <span className="form-error t-error-msg">{error}</span>}
    </div>
  );
}
