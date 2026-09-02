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
    <div className="relative border-l border-gray-800 ml-4 py-2 space-y-8">
      {events.map((event, index) => (
        <motion.div 
          key={event.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative pl-8"
        >
          <div className={`absolute -left-2.5 top-0 p-0.5 rounded-full bg-[#0f0f1a] ${event.isCompleted ? 'text-emerald-500' : 'text-gray-500'}`}>
            {event.icon}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <div>
              <h4 className={`text-base font-medium ${event.isCompleted ? 'text-white' : 'text-gray-400'}`}>
                {event.title}
              </h4>
              <p className="text-sm text-gray-500 mt-1">{event.description}</p>
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap">
              {new Date(event.timestamp).toLocaleString()}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
