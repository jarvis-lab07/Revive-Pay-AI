import React, { useMemo, useState } from 'react';
import { mockCustomers, type CustomerRecord } from '../lib/mockData';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { DataTable } from '../components/ui/DataTable';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../components/ui/Toast';
import { Search, Download, Users, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const riskVariant = (risk: CustomerRecord['risk']) =>
  risk === 'high' ? 'error' : risk === 'medium' ? 'warning' : 'success';

const statusVariant = (status: CustomerRecord['status']) =>
  status === 'recovered' ? 'success' : status === 'at_risk' ? 'warning' : 'info';

export const Customers: React.FC = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | CustomerRecord['risk']>('all');

  const filtered = useMemo(() => {
    return mockCustomers.filter((c) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q);
      const matchesRisk = riskFilter === 'all' || c.risk === riskFilter;
      return matchesQuery && matchesRisk;
    });
  }, [query, riskFilter]);

  const summary = useMemo(() => {
    const atRisk = mockCustomers.filter((c) => c.status === 'at_risk').length;
    const ltv = mockCustomers.reduce((sum, c) => sum + c.lifetimeValue, 0);
    const open = mockCustomers.reduce((sum, c) => sum + c.openCases, 0);
    return { atRisk, ltv, open, total: mockCustomers.length };
  }, []);

  const handleExport = () => {
    const header = 'Name,Email,Phone,LTV,Open Cases,Risk,Status\n';
    const rows = filtered
      .map(
        (c) =>
          `"${c.name}","${c.email}","${c.phone}",${c.lifetimeValue},${c.openCases},${c.risk},${c.status}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recoverai-customers.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast('Customer CSV exported', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted mb-1.5">Directory</p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink tracking-tight">Customers</h1>
          <p className="text-ink-muted text-sm mt-1">Track LTV, risk, and open recovery cases per customer.</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download size={16} /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total customers', value: summary.total },
          { label: 'At risk', value: summary.atRisk },
          { label: 'Open cases', value: summary.open },
          { label: 'Combined LTV', value: `₹${(summary.ltv / 100000).toFixed(1)}L` },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card className="!p-4">
              <div className="text-[11px] uppercase tracking-[0.08em] text-ink-muted font-semibold">{item.label}</div>
              <div className="font-display text-xl font-semibold text-ink mt-1">{item.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="!p-0 overflow-hidden">
        <div className="p-4 md:p-5 border-b border-border flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field pl-9"
              placeholder="Search name, email, or phone…"
            />
          </div>
          <div className="flex gap-1.5">
            {(['all', 'low', 'medium', 'high'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                  riskFilter === r ? 'bg-primary text-white' : 'bg-slate-100 text-ink-muted hover:text-ink'
                }`}
              >
                {r === 'all' ? 'All risk' : r}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No customers found"
            description="Adjust your search or risk filter to see results."
            icon={<Users size={32} />}
          />
        ) : (
          <div className="p-2 md:p-3">
            <DataTable
              data={filtered}
              keyExtractor={(c) => c.id}
              columns={[
                {
                  key: 'name',
                  header: 'Customer',
                  render: (c) => (
                    <div className="flex items-center gap-3">
                      <img src={c.avatarUrl} alt="" className="w-9 h-9 rounded-full ring-2 ring-white shadow-soft" />
                      <div>
                        <div className="font-semibold text-ink">{c.name}</div>
                        <div className="text-xs text-ink-muted flex items-center gap-1 mt-0.5">
                          <Mail size={11} /> {c.email}
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'phone',
                  header: 'Phone',
                  render: (c) => (
                    <span className="text-ink-secondary text-xs inline-flex items-center gap-1.5">
                      <Phone size={12} className="text-ink-muted" /> {c.phone}
                    </span>
                  ),
                },
                {
                  key: 'lifetimeValue',
                  header: 'LTV',
                  render: (c) => (
                    <span className="font-mono text-xs text-ink font-medium">
                      ₹{c.lifetimeValue.toLocaleString('en-IN')}
                    </span>
                  ),
                },
                {
                  key: 'openCases',
                  header: 'Open cases',
                  render: (c) => (
                    <span className={`font-semibold ${c.openCases > 0 ? 'text-amber-700' : 'text-ink-muted'}`}>
                      {c.openCases}
                    </span>
                  ),
                },
                {
                  key: 'risk',
                  header: 'Risk',
                  render: (c) => <Badge variant={riskVariant(c.risk)}>{c.risk}</Badge>,
                },
                {
                  key: 'status',
                  header: 'Status',
                  render: (c) => (
                    <Badge variant={statusVariant(c.status)}>{c.status.replace('_', ' ')}</Badge>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Card>
    </div>
  );
};
