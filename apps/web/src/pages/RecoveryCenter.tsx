import React, { useState, useEffect, useMemo } from 'react';
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
import {
  Sparkles, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Brain,
  SlidersHorizontal, Inbox, Search, X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_FILTERS = ['all', 'pending', 'recovered', 'failed'] as const;

export const RecoveryCenter: React.FC = () => {
  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;
  const { openCheckout, isLoading: checkoutLoading } = useRazorpayCheckout();
  const { toast } = useToast();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'analyze' | null;
    paymentId?: string;
    errorMsg?: string;
    aiData?: any;
  }>({ isOpen: false, type: null });

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const filteredCases = useMemo(() => {
    return mockRecoveryCases.filter((c) => {
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        c.customer.name.toLowerCase().includes(q) ||
        c.failureReason.toLowerCase().includes(q) ||
        c.recommendedAction.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [query, statusFilter]);

  const handleAnalyze = async (caseId: string) => {
    setActiveCaseId(caseId);
    try {
      const response = await AIService.analyzeCase(caseId);
      setModalState({ isOpen: true, type: 'analyze', aiData: response.data });
      setIsEditingMessage(false);
      toast('AI analysis complete', 'success');
    } catch {
      toast('Failed to analyze case', 'error');
    } finally {
      setActiveCaseId(null);
    }
  };

  const handleApproveAction = async (approved: boolean) => {
    try {
      await AIService.approveAction(activeCaseId || 'demo_case_id', approved, modalState.aiData);
      setModalState({ isOpen: false, type: null });
      toast(approved ? 'Action approved and queued' : 'Action rejected', approved ? 'success' : 'info');
    } catch {
      toast('Failed to process approval', 'error');
    }
  };

  const handleRetryPayment = (caseId: string) => {
    setActiveCaseId(caseId);
    openCheckout(caseId, {
      onSuccess: (paymentId) => {
        setModalState({ isOpen: true, type: 'success', paymentId });
        setActiveCaseId(null);
        toast('Payment recovered successfully', 'success');
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

  const handleBatchRecover = () => {
    const pending = filteredCases.filter((c) => c.status === 'pending').length;
    if (pending === 0) {
      toast('No pending cases to recover', 'info');
      return;
    }
    toast(`Queued ${pending} cases for batch recovery`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted mb-1.5">Actions</p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink tracking-tight">Recovery Center</h1>
          <p className="text-ink-muted text-sm mt-1">Review AI recommendations and recover failed payments.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setShowFilters((v) => !v)} aria-expanded={showFilters}>
            <SlidersHorizontal size={16} /> Filter
          </Button>
          <Button onClick={handleBatchRecover}>Batch Recover</Button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="!p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={16} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="input-field pl-9"
                    placeholder="Search by customer, issue, or action…"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {STATUS_FILTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                        statusFilter === s
                          ? 'bg-primary text-white shadow-soft'
                          : 'bg-slate-100 text-ink-muted hover:text-ink'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {(query || statusFilter !== 'all') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setQuery('');
                      setStatusFilter('all');
                    }}
                  >
                    <X size={14} /> Clear
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {isPageLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <SkeletonList count={8} />
        </div>
      ) : filteredCases.length === 0 ? (
        <Card>
          <EmptyState
            title="No matching cases"
            description="Try adjusting filters, or wait for new failed payments to appear."
            icon={<Inbox size={36} />}
            action={
              <Button variant="outline" size="sm" onClick={() => { setQuery(''); setStatusFilter('all'); }}>
                Reset filters
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredCases.map((caseItem, index) => (
              <motion.div
                key={caseItem.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: Math.min(index * 0.03, 0.2), ease: [0.22, 1, 0.36, 1] }}
              >
                <Card hover className="h-full flex flex-col !p-5 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={caseItem.customer.avatarUrl}
                        alt=""
                        className="w-10 h-10 rounded-full ring-2 ring-white shadow-soft shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-ink text-sm truncate">{caseItem.customer.name}</div>
                        <div className="text-xs text-ink-muted font-mono">{formatCurrency(caseItem.amount)}</div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        caseItem.status === 'pending' ? 'warning' : caseItem.status === 'recovered' ? 'success' : 'error'
                      }
                    >
                      {caseItem.status}
                    </Badge>
                  </div>

                  <div className="surface-muted rounded-xl p-3 mb-4 flex-1">
                    <div className="text-[10px] text-ink-muted mb-1 uppercase tracking-[0.1em] font-semibold">Issue</div>
                    <div className="text-sm font-medium text-ink mb-3">{caseItem.failureReason}</div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
                      <Sparkles size={12} />
                      AI · {caseItem.aiConfidence}%
                    </div>
                    <div className="text-sm text-ink-secondary leading-snug">{caseItem.recommendedAction}</div>
                  </div>

                  <div className="flex flex-col gap-2 mt-auto">
                    {caseItem.status === 'pending' && (
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => handleAnalyze(caseItem.id)}
                        isLoading={activeCaseId === caseItem.id && !checkoutLoading}
                      >
                        <Brain size={16} />
                        Analyze with AI
                      </Button>
                    )}
                    {caseItem.status === 'recovered' ? (
                      <div className="flex items-center justify-center gap-2 py-2.5 text-sm text-emerald-700 font-semibold bg-emerald-50 rounded-xl">
                        <CheckCircle2 size={16} />
                        Recovered
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleRetryPayment(caseItem.id)}
                        disabled={checkoutLoading}
                      >
                        <RefreshCw size={15} />
                        Force Retry
                      </Button>
                    )}
                    <Button variant="ghost" className="w-full text-ink-muted group-hover:text-ink" size="sm">
                      View details
                      <ArrowRight size={14} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal isOpen={modalState.isOpen} onClose={() => setModalState({ isOpen: false, type: null })} size="lg">
        <div className="text-center py-1">
          {modalState.type === 'success' && (
            <>
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 border border-emerald-100"
              >
                <CheckCircle2 size={32} />
              </motion.div>
              <h3 className="font-display text-xl font-semibold text-ink mb-1.5">Payment recovered</h3>
              <p className="text-ink-muted mb-5 text-sm">Transaction processed. Metrics will refresh shortly.</p>
              <div className="surface-muted rounded-xl p-4 text-sm text-left mb-5 space-y-2.5">
                <div className="flex justify-between gap-3">
                  <span className="text-ink-muted">Payment ID</span>
                  <span className="text-ink font-mono text-xs truncate">{modalState.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Timestamp</span>
                  <span className="text-ink text-xs">{new Date().toLocaleString()}</span>
                </div>
              </div>
              <Button className="w-full" onClick={() => setModalState({ isOpen: false, type: null })}>
                Done
              </Button>
            </>
          )}

          {modalState.type === 'analyze' && (
            <>
              <div className="mx-auto w-14 h-14 bg-primary-soft text-primary rounded-2xl flex items-center justify-center mb-4">
                <Brain size={28} />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink mb-4">AI analysis ready</h3>
              <div className="surface-muted rounded-xl p-4 text-left mb-5 space-y-4">
                <div>
                  <span className="text-[10px] text-ink-muted uppercase tracking-[0.1em] font-semibold">Reason</span>
                  <p className="text-sm text-ink-secondary mt-1">{modalState.aiData?.reason}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-ink-muted uppercase tracking-[0.1em] font-semibold">Confidence</span>
                    <p className="text-xl font-display font-semibold text-emerald-700 mt-1">{modalState.aiData?.confidence}%</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-ink-muted uppercase tracking-[0.1em] font-semibold">Severity</span>
                    <p className="text-sm font-semibold text-rose-600 mt-1.5">{modalState.aiData?.severity}</p>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted uppercase tracking-[0.1em] font-semibold">Recommended action</span>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="info">{modalState.aiData?.recommendedAction}</Badge>
                    {modalState.aiData?.requiresMerchantApproval && <Badge variant="warning">Needs approval</Badge>}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted uppercase tracking-[0.1em] font-semibold">Explanation</span>
                  <p className="text-sm text-ink-secondary mt-1 leading-relaxed">{modalState.aiData?.explanation}</p>
                </div>
                <div>
                  <span className="text-[10px] text-ink-muted uppercase tracking-[0.1em] font-semibold">Customer message</span>
                  {isEditingMessage ? (
                    <div className="mt-2">
                      <CustomerMessageEditor
                        initialMessage={modalState.aiData?.customerMessage}
                        onSave={(msg) => {
                          setModalState((prev) => ({ ...prev, aiData: { ...prev.aiData, customerMessage: msg } }));
                          setIsEditingMessage(false);
                          toast('Message updated', 'success');
                        }}
                        onCancel={() => setIsEditingMessage(false)}
                      />
                    </div>
                  ) : (
                    <div
                      className="flex justify-between items-start mt-2 cursor-pointer group/msg rounded-lg p-2 -mx-2 hover:bg-white/70"
                      onClick={() => setIsEditingMessage(true)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingMessage(true)}
                    >
                      <p className="text-sm text-ink-secondary italic flex-1 text-left">"{modalState.aiData?.customerMessage}"</p>
                      <span className="text-xs text-primary opacity-0 group-hover/msg:opacity-100 transition-opacity ml-2 font-medium">
                        Edit
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => handleApproveAction(false)}>
                  Reject
                </Button>
                <Button variant="primary" className="flex-1" onClick={() => handleApproveAction(true)}>
                  Approve action
                </Button>
              </div>
            </>
          )}

          {modalState.type === 'error' && (
            <>
              <div className="mx-auto w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4 border border-rose-100">
                <AlertCircle size={28} />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink mb-1.5">Payment failed</h3>
              <p className="text-ink-muted mb-6 text-sm">{modalState.errorMsg}</p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setModalState({ isOpen: false, type: null })}>
                  Close
                </Button>
                <Button variant="primary" className="flex-1" onClick={() => setModalState({ isOpen: false, type: null })}>
                  <RefreshCw size={15} /> Try again
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
