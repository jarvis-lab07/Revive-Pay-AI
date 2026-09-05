import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '', ...props }) => {
  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    error: 'bg-rose-50 text-rose-700 border border-rose-200',
    info: 'bg-sky-50 text-sky-700 border border-sky-200',
    default: 'bg-slate-100 text-slate-600 border border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold tracking-wide ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
