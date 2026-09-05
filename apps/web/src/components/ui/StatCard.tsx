import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => {
  return (
    <Card className="flex flex-col" hover>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-ink-muted font-medium text-sm">{title}</h3>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-semibold text-ink">{value}</span>
        {trend && (
          <span className={`text-xs font-semibold ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend.isPositive ? '+' : '-'}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </Card>
  );
};
