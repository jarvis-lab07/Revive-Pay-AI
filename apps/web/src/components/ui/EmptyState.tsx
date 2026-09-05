import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center p-12 text-center h-full w-full"
  >
    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 text-ink-muted border border-border">
      {icon}
    </div>
    <h3 className="font-display text-lg font-semibold text-ink mb-1.5">{title}</h3>
    <p className="text-ink-muted text-sm max-w-sm mb-6 leading-relaxed">{description}</p>
    {action}
  </motion.div>
);
