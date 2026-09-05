import React, { useMemo, useState } from 'react';
import { mockAuditLogs } from '../lib/mockData';
import { Card } from '../components/ui/Card';
import { CheckCircle2, AlertCircle, XCircle, Clock, Search, FileText } from 'lucide-react';
import { Timeline, TimelineEvent } from '../components/ui/Timeline';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { Badge } from '../components/ui/Badge';

export const AuditTrail: React.FC = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'warning' | 'error'>('all');

  const getIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 size={18} />;
      case 'warning':
        return <AlertCircle size={18} />;
      case 'error':
        return <XCircle size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  const filtered = useMemo(() => {
    return mockAuditLogs.filter((log) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        log.eventType.toLowerCase().includes(q) ||
        log.aiExplanation.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter]);

  const timelineEvents: TimelineEvent[] = filtered.map((log) => ({
    id: log.id,
    title: log.eventType,
    description: log.aiExplanation || 'System action recorded.',
    timestamp: log.timestamp,
    icon: getIcon(log.status),
    isCompleted: log.status === 'success',
  }));

  const handleExport = () => {
    const header = 'Timestamp,Event,Status,Approved,Explanation\n';
    const rows = filtered
      .map(
        (l) =>
          `"${l.timestamp}","${l.eventType}","${l.status}",${l.merchantApproved},"${l.aiExplanation.replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recoverai-audit.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast('Audit CSV exported', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted mb-1.5">Compliance</p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink tracking-tight">Audit Trail</h1>
          <p className="text-ink-muted text-sm mt-1">Immutable record of system and AI recovery actions.</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <FileText size={16} /> Export CSV
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={16} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by action or explanation…"
              className="input-field pl-9"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {(['all', 'success', 'warning', 'error'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                  statusFilter === s ? 'bg-primary text-white' : 'bg-slate-100 text-ink-muted hover:text-ink'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-5">
          <Badge variant="default">{filtered.length} events</Badge>
        </div>

        {timelineEvents.length === 0 ? (
          <EmptyState
            title="No audit events"
            description="No events match your current filters."
            icon={<FileText size={32} />}
          />
        ) : (
          <Timeline events={timelineEvents} />
        )}
      </Card>
    </div>
  );
};
