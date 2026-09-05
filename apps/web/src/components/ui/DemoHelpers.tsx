import React, { useState } from 'react';
import { Settings2, RefreshCw, Zap, Database, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { useToast } from './Toast';
import { useQueryClient } from '@tanstack/react-query';

export const DemoHelpers: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAction = async (action: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      toast(`${action} executed successfully`, 'success');
      queryClient.invalidateQueries();
    } catch {
      toast(`Failed to execute ${action}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-[90]">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-11 h-11 bg-accent text-white hover:opacity-90 rounded-xl flex items-center justify-center shadow-panel border border-accent/20 transition-all"
          aria-label="Demo Helpers Menu"
        >
          <Settings2 size={18} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              className="absolute bottom-14 left-0 w-64 bg-white border border-border rounded-2xl shadow-lift p-3.5 flex flex-col gap-2"
            >
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted mb-1 flex items-center gap-1.5 px-1">
                <AlertCircle size={12} /> Demo Helpers
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => handleAction('Seed Demo Case')}
                disabled={isLoading}
              >
                <Database size={14} className="text-sky-600" />
                Seed Demo Case
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => handleAction('Trigger Webhook')}
                disabled={isLoading}
              >
                <Zap size={14} className="text-amber-600" />
                Fake Webhook Trigger
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs hover:border-rose-200 hover:text-rose-700"
                onClick={() => handleAction('Reset Data')}
                disabled={isLoading}
              >
                <RefreshCw size={14} className="text-rose-600" />
                Reset Demo Data
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
