import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string | null;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, rightIcon, id, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <label htmlFor={id} className="text-sm font-medium text-text-main">
          {label}
        </label>
        <div className="relative flex items-center">
          <input
            id={id}
            ref={ref}
            className={`w-full h-11 px-3 py-2 text-base rounded-[12px] border ${
              error ? 'border-error' : 'border-border-main focus:border-primary'
            } outline-none transition-colors bg-white text-text-main ${className}`}
            {...props}
          />
          {rightIcon && <div className="absolute right-3">{rightIcon}</div>}
        </div>
        {error && (
          <p className="text-sm text-error mt-1" id={`${id}-error`} aria-live="polite">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', loading, className = '', disabled, ...props }, ref) => {
    const baseStyles = 'h-11 px-4 py-2 font-medium text-base rounded-[16px] transition-colors flex items-center justify-center select-none';
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-hover disabled:bg-primary/50 disabled:cursor-not-allowed',
      secondary: 'bg-primary-soft text-primary hover:bg-primary/20 active:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed',
      danger: 'bg-error text-white hover:bg-error/90 active:bg-error/80 disabled:opacity-50 disabled:cursor-not-allowed',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando...
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';
