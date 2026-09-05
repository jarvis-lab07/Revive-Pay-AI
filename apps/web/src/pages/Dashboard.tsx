import React, { useState, useEffect, useMemo } from 'react';
import {
  mockDashboardStats,
  mockRecoveryTrendData,
  mockFailureReasonData,
  mockRecoveryCases,
} from '../lib/mockData';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import {
  DollarSign, ShieldCheck, AlertCircle, Clock, Sparkles, BrainCircuit,
  TrendingUp, BarChart2, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PERIODS = ['7d', '30d', '90d'] as const;

const StatSkeleton = () => (
  <div className="surface p-5 animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="w-10 h-10 rounded-xl skeleton-shimmer" />
      <div className="w-14 h-5 rounded-md skeleton-shimmer" />
    </div>
    <div className="w-24 h-8 skeleton-shimmer rounded mb-2" />
    <div className="w-32 h-4 skeleton-shimmer rounded" />
  </div>
);

const ChartSkeleton = () => (
  <div className="surface p-6 animate-pulse h-72">
    <div className="w-40 h-5 skeleton-shimmer rounded mb-6" />
    <div className="h-full skeleton-shimmer rounded-xl" />
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-border rounded-xl p-3 shadow-panel text-xs">
        <p className="text-ink-muted mb-1.5 font-medium">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">
            {p.name}: ₹{Number(p.value).toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('30d');

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 650);
    return () => clearTimeout(timer);
  }, [period]);

  const chartData = useMemo(() => {
    if (period === '7d') return mockRecoveryTrendData;
    if (period === '90d') {
      return [
        ...mockRecoveryTrendData,
        { date: 'W2', atRisk: 4200, recovered: 3100 },
        { date: 'W3', atRisk: 3800, recovered: 2900 },
        { date: 'W4', atRisk: 5100, recovered: 4400 },
      ];
    }
    return mockRecoveryTrendData;
  }, [period]);

  const stats = [
    {
      label: 'Revenue at Risk',
      value: `₹${(mockDashboardStats.revenueAtRisk / 100000).toFixed(1)}L`,
      icon: AlertCircle,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      trend: '+8.2%',
      up: true,
      bad: true,
    },
    {
      label: 'Revenue Recovered',
      value: `₹${(mockDashboardStats.revenueRecovered / 100000).toFixed(1)}L`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      trend: '+23.5%',
      up: true,
      bad: false,
    },
    {
      label: 'Recovery Rate',
      value: `${mockDashboardStats.recoverySuccessRate}%`,
      icon: ShieldCheck,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      trend: '+4.1%',
      up: true,
      bad: false,
    },
    {
      label: 'Avg. Recovery Time',
      value: mockDashboardStats.avgRecoveryTime,
      icon: Clock,
      color: 'text-primary',
      bg: 'bg-primary-soft',
      trend: '-12min',
      up: false,
      bad: false,
    },
  ];

  return (
    <div className="space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted mb-1.5">Overview</p>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink tracking-tight">Dashboard</h1>
          <p className="text-ink-muted text-sm mt-1">Live recovery performance across your payment stack.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1.5 py-1.5 px-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            Live
          </Badge>
          <div className="flex p-0.5 rounded-xl bg-slate-100 border border-border">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  period === p ? 'bg-white text-ink shadow-soft' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          : stats.map((stat, index) => {
              const Icon = stat.icon;
              const TrendIcon = stat.up ? ArrowUpRight : ArrowDownRight;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Card hover className="h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl`}>
                        <Icon size={18} />
                      </div>
                      <span
                        className={`text-xs font-semibold inline-flex items-center gap-0.5 ${
                          stat.bad ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        <TrendIcon size={13} /> {stat.trend}
                      </span>
                    </div>
                    <div className="font-display text-2xl font-semibold text-ink mb-0.5">{stat.value}</div>
                    <div className="text-sm text-ink-muted">{stat.label}</div>
                  </Card>
                </motion.div>
              );
            })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <Card>
              <h3 className="font-display text-base font-semibold text-ink mb-5 flex items-center gap-2">
                <TrendingUp size={17} className="text-primary" /> Recovery Trend
              </h3>
              {chartData.length === 0 ? (
                <EmptyState title="No trend data" description="Data will appear once you have recovery history." icon={<BarChart2 size={28} />} />
              ) : (
                <ResponsiveContainer width="100%" height={230}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="recovered" stroke="#0f766e" strokeWidth={2.5} dot={false} name="Recovered" />
                    <Line type="monotone" dataKey="atRisk" stroke="#e11d48" strokeWidth={2} strokeDasharray="4 4" dot={false} name="At Risk" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card>
          )}
        </div>

        <div>
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <Card className="h-full">
              <h3 className="font-display text-base font-semibold text-ink mb-5 flex items-center gap-2">
                <AlertCircle size={17} className="text-rose-600" /> Failure Breakdown
              </h3>
              {mockFailureReasonData.length === 0 ? (
                <EmptyState title="No failures" description="All payments successful." icon={<ShieldCheck size={28} />} />
              ) : (
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={mockFailureReasonData} layout="vertical" barSize={11}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="reason"
                      tick={{ fill: '#475569', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      width={92}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#0f766e" radius={[0, 6, 6, 0]} name="Cases" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          )}
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
            <Sparkles size={17} className="text-primary" /> Recent Recovery Cases
          </h3>
          <Link to="/recovery">
            <Button variant="ghost" size="sm">
              View all →
            </Button>
          </Link>
        </div>
        {mockRecoveryCases.length === 0 ? (
          <EmptyState title="No cases" description="No recovery cases yet." icon={<ShieldCheck size={28} />} />
        ) : (
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm" role="table" aria-label="Recent recovery cases">
              <thead>
                <tr className="border-b border-border">
                  {['Customer', 'Amount', 'Issue', 'AI Confidence', 'Status'].map((h) => (
                    <th key={h} className="text-left py-3 px-3 text-[11px] uppercase tracking-[0.08em] text-ink-muted font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {mockRecoveryCases.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img src={c.customer.avatarUrl} alt="" className="w-7 h-7 rounded-full ring-2 ring-white" />
                        <span className="text-ink font-medium">{c.customer.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-ink-secondary font-mono text-xs">₹{c.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-ink-muted max-w-[180px] truncate">{c.failureReason}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-1.5 max-w-[80px]">
                          <div className="bg-primary h-1.5 rounded-full transition-all duration-500" style={{ width: `${c.aiConfidence}%` }} />
                        </div>
                        <span className="text-ink-muted text-xs font-medium">{c.aiConfidence}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant={c.status === 'pending' ? 'warning' : c.status === 'recovered' ? 'success' : 'error'}>
                        {c.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="bg-gradient-to-br from-white to-teal-50/40 border-primary/15">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-xl bg-primary-soft text-primary">
            <BrainCircuit size={20} />
          </div>
          <h3 className="font-display text-base font-semibold text-ink">AI Recovery Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { n: 1, text: '12 payments failed due to Bank Timeout today. Auto-retry within 2 hours recommended.' },
            { n: 2, text: 'High-value customers respond 40% better to personalized WhatsApp reminders.' },
            { n: 3, text: 'Retrying Insufficient Funds errors after 24 hours has a 75% recovery probability.' },
          ].map(({ n, text }) => (
            <div key={n} className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-primary text-white font-display font-semibold flex items-center justify-center text-xs shrink-0">
                {n}
              </div>
              <p className="text-sm text-ink-secondary leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
