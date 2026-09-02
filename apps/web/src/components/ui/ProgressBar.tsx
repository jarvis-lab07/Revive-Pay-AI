import React from 'react';

interface ProgressBarProps {
  progress: number;
  color?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = 'bg-primary', className = '' }) => {
  return (
    <div className={`w-full bg-gray-800 rounded-full h-2.5 ${className}`}>
      <div
        className={`${color} h-2.5 rounded-full transition-all duration-500`}
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
      ></div>
    </div>
  );
};
