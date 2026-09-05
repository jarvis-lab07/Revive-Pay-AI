import React, { useState } from 'react';
import { Bell, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'PAYMENT_RECOVERED', title: 'Payment Recovered', message: 'Successfully recovered ₹12,000 from Priya Patel.', time: '2m ago', read: false },
  { id: '2', type: 'APPROVAL_REQUIRED', title: 'Approval Required', message: 'AI suggests 10% coupon for abandoned checkout (Amit Singh).', time: '15m ago', read: false },
  { id: '3', type: 'RETRY_FAILED', title: 'Retry Failed', message: 'Auto-retry for Rahul Sharma failed due to Bank Timeout.', time: '1h ago', read: true },
];

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'PAYMENT_RECOVERED':
        return <CheckCircle2 size={16} className="text-emerald-600" />;
      case 'APPROVAL_REQUIRED':
        return <AlertCircle size={16} className="text-amber-600" />;
      case 'RETRY_FAILED':
        return <RefreshCw size={16} className="text-rose-600" />;
      default:
        return <Bell size={16} className="text-ink-muted" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-ink-muted hover:text-ink hover:bg-slate-100 rounded-xl transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 ring-2 ring-white" />
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 mt-2 w-80 bg-white border border-border rounded-2xl shadow-lift z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-border flex justify-between items-center bg-slate-50/80">
                <h3 className="font-display font-semibold text-ink text-sm">Notifications</h3>
                <button
                  className="text-xs font-medium text-primary hover:text-primary-hover transition-colors"
                  onClick={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-ink-muted text-sm">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-4 border-b border-border/60 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3 ${
                        !n.read ? 'bg-primary-soft/40' : ''
                      }`}
                    >
                      <div className="mt-0.5">{getIcon(n.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm ${!n.read ? 'text-ink font-semibold' : 'text-ink-secondary'}`}>
                          {n.title}
                        </div>
                        <div className="text-xs text-ink-muted mt-1 line-clamp-2">{n.message}</div>
                        <div className="text-[11px] text-ink-muted mt-2">{n.time}</div>
                      </div>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
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
