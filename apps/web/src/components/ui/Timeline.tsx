import React from 'react';
import { motion } from 'framer-motion';

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  isCompleted?: boolean;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="relative border-l border-border ml-3 py-1 space-y-7">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="relative pl-8"
        >
          <div
            className={`absolute -left-[13px] top-0 p-1 rounded-full bg-white border border-border ${
              event.isCompleted ? 'text-emerald-600' : 'text-ink-muted'
            }`}
          >
            {event.icon}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div>
              <h4 className={`text-sm font-semibold ${event.isCompleted ? 'text-ink' : 'text-ink-secondary'}`}>
                {event.title}
              </h4>
              <p className="text-sm text-ink-muted mt-1 leading-relaxed">{event.description}</p>
            </div>
            <div className="text-xs text-ink-muted whitespace-nowrap font-medium">
              {new Date(event.timestamp).toLocaleString()}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
