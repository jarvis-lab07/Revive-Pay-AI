import React, { useState, useEffect } from 'react';
import { mockRecoveryCases } from '../lib/mockData';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { SkeletonList } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { CustomerMessageEditor } from '../components/ui/CustomerMessageEditor';
import { useToast } from '../components/ui/Toast';
import { useRazorpayCheckout } from '../hooks/useRazorpayCheckout';
import { AIService } from '../services/ai';
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Brain, SlidersHorizontal, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RecoveryCenter: React.FC = () => {
  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;
  const { openCheckout, isLoading: checkoutLoading } = useRazorpayCheckout();
  const { toast } = useToast();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'analyze' | null;
    paymentId?: string;
    errorMsg?: string;
    aiData?: any;
  }>({ isOpen: false, type: null });

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const handleAnalyze = async (caseId: string) => {
    setActiveCaseId(caseId);
    try {
      const response = await AIService.analyzeCase(caseId);
      setModalState({ isOpen: true, type: 'analyze', aiData: response.data });
      setIsEditingMessage(false);
      toast('AI analysis complete', 'success');
    } catch (error) {
      toast('Failed to analyze case', 'error');
    } finally {
      setActiveCaseId(null);
    }
  };

  const handleApproveAction = async (approved: boolean) => {
    try {
      await AIService.approveAction(activeCaseId || 'demo_case_id', approved, modalState.aiData);
      setModalState({ isOpen: false, type: null });
      toast(approved ? 'Action approved and sent!' : 'Action rejected', approved ? 'success' : 'info');
    } catch (error) {
      toast('Failed to process approval', 'error');
    }
  };

  const handleRetryPayment = (caseId: string) => {
    setActiveCaseId(caseId);
    openCheckout(caseId, {
      onSuccess: (paymentId) => {
        setModalState({ isOpen: true, type: 'success', paymentId });
        setActiveCaseId(null);
        toast('Payment recovered successfully!', 'success');
      },
      onError: (error) => {
        setModalState({
          isOpen: true,
          type: 'error',
          errorMsg: error?.description || error?.message || 'Payment failed. Please try again.',
        });
        setActiveCaseId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Recovery Center</h1>
          <p className="text-gray-400 text-sm mt-1">AI-driven actionable recommendations for failed transactions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" aria-label="Filter cases">
            <SlidersHorizontal size={16} /> Filter
          </Button>
          <Button aria-label="Batch recover cases">Batch Recover</Button>
        </div>
      </div>

      {/* Cards Grid */}
      {isPageLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <SkeletonList count={8} />
        </div>
      ) : mockRecoveryCases.length === 0 ? (
        <Card>
          <EmptyState
            title="No Recovery Cases"
            description="All payments are healthy! New failed transactions will appear here."
            icon={<Inbox size={40} />}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {mockRecoveryCases.map((caseItem, index) => (
              <motion.div
                key={caseItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.04 }}
              >
                <Card className="h-full flex flex-col hover:border-primary/50 transition-all duration-200 group">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={caseItem.customer.avatarUrl}
                        alt={`${caseItem.customer.name} avatar`}
                        className="w-10 h-10 rounded-full bg-gray-700 ring-2 ring-gray-800"
                      />
                      <div>
                        <div className="font-medium text-white text-sm">{caseItem.customer.name}</div>
                        <div className="text-xs text-gray-500">{formatCurrency(caseItem.amount)}</div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        caseItem.status === 'pending' ? 'warning' :
                        caseItem.status === 'recovered' ? 'success' : 'error'
                      }
                    >
                      {caseItem.status}
                    </Badge>
                  </div>

                  {/* AI Insight Box */}
                  <div className="bg-black/20 rounded-lg p-3 mb-4 flex-1 border border-gray-800/50">
                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Issue Detected</div>
                    <div className="text-sm font-medium text-gray-200 mb-3">{caseItem.failureReason}</div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-primary mb-1">
                      <Sparkles size={12} />
                      AI Recommendation ({caseItem.aiConfidence}% confidence)
                    </div>
                    <div className="text-sm text-gray-300">{caseItem.recommendedAction}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {caseItem.status === 'pending' && (
                      <Button
                        variant="primary"
                        className="w-full gap-2"
                        onClick={() => handleAnalyze(caseItem.id)}
                        isLoading={activeCaseId === caseItem.id && !checkoutLoading}
                        aria-label={`Analyze case for ${caseItem.customer.name} with AI`}
                      >
                        <Brain size={16} />
                        Analyze with AI
                      </Button>
                    )}
                    {caseItem.status === 'recovered' ? (
                      <div className="flex items-center justify-center gap-2 py-2 text-sm text-emerald-500 font-medium">
                        <CheckCircle2 size={16} />
                        Recovered
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleRetryPayment(caseItem.id)}
                        disabled={checkoutLoading}
                        aria-label={`Force retry payment for ${caseItem.customer.name}`}
                      >
                        <RefreshCw size={16} className="mr-2" />
                        Force Retry
                      </Button>
                    )}
                    <Button variant="secondary" className="w-full group-hover:bg-gray-800 transition-colors" aria-label="View case details">
                      View Details
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Result Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: null })}
      >
        <div className="text-center py-2">
          {/* Success */}
          {modalState.type === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="mx-auto w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-5"
              >
                <CheckCircle2 size={40} />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">Payment Recovered! 🎉</h3>
              <p className="text-gray-400 mb-5 text-sm">
                Transaction processed successfully. Dashboard metrics updated.
              </p>
              <div className="bg-black/30 rounded-lg p-4 text-sm text-left mb-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment ID</span>
                  <span className="text-white font-mono text-xs">{modalState.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Timestamp</span>
                  <span className="text-white text-xs">{new Date().toLocaleString()}</span>
                </div>
              </div>
              <Button className="w-full" onClick={() => setModalState({ isOpen: false, type: null })}>
                Back to Dashboard
              </Button>
            </>
          )}

          {/* AI Analysis */}
          {modalState.type === 'analyze' && (
            <>
              <div className="mx-auto w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4">
                <Brain size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">AI Analysis Complete</h3>
              <div className="bg-black/30 rounded-lg p-4 text-left mb-5 space-y-4">
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Reason</span>
                  <p className="text-sm text-gray-300 mt-1">{modalState.aiData?.reason}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Confidence</span>
                    <p className="text-xl font-bold text-emerald-400 mt-1">{modalState.aiData?.confidence}%</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Severity</span>
                    <p className="text-sm font-bold text-rose-400 mt-1">{modalState.aiData?.severity}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Recommended Action</span>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="info">{modalState.aiData?.recommendedAction}</Badge>
                    {modalState.aiData?.requiresMerchantApproval && (
                      <Badge variant="warning">Requires Approval</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Explanation</span>
                  <p className="text-sm text-gray-300 mt-1">{modalState.aiData?.explanation}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Customer Message</span>
                  {isEditingMessage ? (
                    <div className="mt-2">
                      <CustomerMessageEditor
                        initialMessage={modalState.aiData?.customerMessage}
                        onSave={(msg) => {
                          setModalState(prev => ({ ...prev, aiData: { ...prev.aiData, customerMessage: msg } }));
                          setIsEditingMessage(false);
                          toast('Message updated', 'success');
                        }}
                        onCancel={() => setIsEditingMessage(false)}
                      />
                    </div>
                  ) : (
                    <div
                      className="flex justify-between items-start mt-2 cursor-pointer group/msg"
                      onClick={() => setIsEditingMessage(true)}
                      role="button"
                      aria-label="Edit customer message"
                      tabIndex={0}
                    >
                      <p className="text-sm text-gray-300 italic flex-1">"{modalState.aiData?.customerMessage}"</p>
                      <span className="text-xs text-primary opacity-0 group-hover/msg:opacity-100 transition-opacity ml-2">Edit</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => handleApproveAction(false)}>
                  Reject
                </Button>
                <Button variant="primary" className="flex-1" onClick={() => handleApproveAction(true)}>
                  Approve Action
                </Button>
              </div>
            </>
          )}

          {/* Error */}
          {modalState.type === 'error' && (
            <>
              <div className="mx-auto w-16 h-16 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Payment Failed</h3>
              <p className="text-gray-400 mb-6 text-sm">{modalState.errorMsg}</p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setModalState({ isOpen: false, type: null })}>
                  Close
                </Button>
                <Button variant="primary" className="flex-1" onClick={() => setModalState({ isOpen: false, type: null })}>
                  <RefreshCw size={16} className="mr-2" /> Try Again
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
