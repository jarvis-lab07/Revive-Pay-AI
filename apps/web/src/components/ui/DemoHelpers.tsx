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

  const handleAction = async (action: string, endpoint: string) => {
    setIsLoading(true);
    try {
      // Mocking API call for demo helpers
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast(`${action} executed successfully`, 'success');
      
      // Invalidate relevant queries
      queryClient.invalidateQueries();
    } catch (error) {
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
          className="w-12 h-12 bg-gray-800 text-gray-300 hover:text-white rounded-full flex items-center justify-center shadow-lg border border-gray-700 hover:border-gray-500 transition-colors z-10 relative"
          aria-label="Demo Helpers Menu"
        >
          <Settings2 size={20} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-16 left-0 w-64 bg-[#161622] border border-gray-700 rounded-xl shadow-2xl p-4 flex flex-col gap-3"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 flex items-center gap-1.5">
                <AlertCircle size={14} /> Demo Helpers
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-xs border-gray-700 hover:bg-white/5"
                onClick={() => handleAction('Seed Demo Case', '/test/seed')}
                disabled={isLoading}
              >
                <Database size={14} className="mr-2 text-blue-400" />
                Seed Demo Case
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-xs border-gray-700 hover:bg-white/5"
                onClick={() => handleAction('Trigger Webhook', '/test/webhook')}
                disabled={isLoading}
              >
                <Zap size={14} className="mr-2 text-amber-400" />
                Fake Webhook Trigger
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-xs border-gray-700 hover:bg-rose-500/20 hover:text-rose-400"
                onClick={() => handleAction('Reset Data', '/test/reset')}
                disabled={isLoading}
              >
                <RefreshCw size={14} className="mr-2 text-rose-500" />
                Reset Demo Data
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
