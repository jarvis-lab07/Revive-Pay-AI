import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 ease-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

  const variants = {
    primary:
      'bg-primary text-white shadow-soft hover:bg-primary-hover hover:shadow-panel',
    secondary:
      'bg-accent text-white shadow-soft hover:opacity-90 hover:shadow-panel',
    outline:
      'border border-border-strong bg-white text-ink-secondary hover:bg-surface-muted hover:border-primary/30 hover:text-ink',
    ghost:
      'text-ink-muted hover:text-ink hover:bg-black/[0.04]',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 shadow-soft',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 py-2 text-sm gap-2',
    lg: 'h-11 px-6 text-sm gap-2',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-0.5 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};
