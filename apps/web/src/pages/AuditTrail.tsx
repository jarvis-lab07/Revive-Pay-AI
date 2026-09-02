import React from 'react';
import { mockAuditLogs } from '../lib/mockData';
import { Card } from '../components/ui/Card';
import { CheckCircle2, AlertCircle, XCircle, Clock, Search, Filter, FileText } from 'lucide-react';
import { Timeline, TimelineEvent } from '../components/ui/Timeline';
import { Button } from '../components/ui/Button';

export const AuditTrail: React.FC = () => {
  const getIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 size={20} />;
      case 'warning': return <AlertCircle size={20} />;
      case 'error': return <XCircle size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const timelineEvents: TimelineEvent[] = mockAuditLogs.map(log => ({
    id: log.id,
    title: log.eventType,
    description: log.aiExplanation || 'System action recorded.',
    timestamp: log.timestamp,
    icon: getIcon(log.status),
    isCompleted: log.status === 'success'
  }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Audit Trail</h1>
          <p className="text-gray-400 text-sm mt-1">Immutable record of all system and AI actions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Filter size={16} /> Filter</Button>
          <Button variant="outline" className="gap-2"><FileText size={16} /> Export CSV</Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by case ID, action, or customer..." 
            className="w-full bg-[#0f0f1a] border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <Timeline events={timelineEvents} />
      </Card>
    </div>
  );
};
