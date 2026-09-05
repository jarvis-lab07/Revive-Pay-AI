import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`surface p-5 md:p-6 transition-all duration-200 ease-smooth ${
        hover ? 'hover:shadow-panel hover:border-primary/20' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
