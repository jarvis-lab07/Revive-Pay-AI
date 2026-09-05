import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-white border border-border rounded-2xl p-6 w-full shadow-lift relative ${
              size === 'lg' ? 'max-w-lg' : 'max-w-md'
            }`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            {title && <h2 className="font-display text-xl font-semibold text-ink mb-4 pr-8">{title}</h2>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
