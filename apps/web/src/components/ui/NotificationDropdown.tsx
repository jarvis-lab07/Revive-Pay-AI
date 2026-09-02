import React, { useState } from 'react';
import { Bell, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'PAYMENT_RECOVERED', title: 'Payment Recovered!', message: 'Successfully recovered ₹12,000 from Priya Patel.', time: '2m ago', read: false },
  { id: '2', type: 'APPROVAL_REQUIRED', title: 'Approval Required', message: 'AI suggests 10% coupon for abandoned checkout (Amit Singh).', time: '15m ago', read: false },
  { id: '3', type: 'RETRY_FAILED', title: 'Retry Failed', message: 'Auto-retry for Rahul Sharma failed due to Bank Timeout.', time: '1h ago', read: true },
];

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'PAYMENT_RECOVERED': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'APPROVAL_REQUIRED': return <AlertCircle size={16} className="text-warning-500 text-amber-500" />;
      case 'RETRY_FAILED': return <RefreshCw size={16} className="text-rose-500" />;
      default: return <Bell size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 ring-2 ring-[#0f0f1a]"></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-[#161622] border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                <h3 className="font-medium text-white">Notifications</h3>
                <button className="text-xs text-primary hover:text-white transition-colors" onClick={() => setNotifications(notifications.map(n => ({...n, read:true})))}>
                  Mark all as read
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => markAsRead(n.id)}
                      className={`p-4 border-b border-gray-800/50 hover:bg-white/5 cursor-pointer transition-colors flex gap-3 ${!n.read ? 'bg-primary/5' : ''}`}
                    >
                      <div className="mt-0.5">{getIcon(n.type)}</div>
                      <div>
                        <div className={`text-sm ${!n.read ? 'text-white font-medium' : 'text-gray-300'}`}>{n.title}</div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">{n.message}</div>
                        <div className="text-xs text-gray-600 mt-2">{n.time}</div>
                      </div>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
