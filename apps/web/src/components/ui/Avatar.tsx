import React from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback, size = 'md' }) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-slate-200 ring-2 ring-white shadow-soft ${sizes[size]} overflow-hidden`}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="font-semibold text-ink-secondary">{fallback}</span>
      )}
    </div>
  );
};
