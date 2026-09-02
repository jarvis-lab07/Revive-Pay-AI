import React, { useState, useEffect } from 'react';
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
import { DollarSign, ShieldCheck, AlertCircle, Clock, Sparkles, BrainCircuit, TrendingUp, BarChart2 } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import { motion } from 'framer-motion';

// --- Skeleton helpers ---
const StatSkeleton = () => (
  <div className="bg-[#161622] rounded-2xl p-6 border border-gray-800 animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="w-10 h-10 rounded-lg bg-gray-800" />
      <div className="w-16 h-5 rounded-full bg-gray-800" />
    </div>
    <div className="w-24 h-8 bg-gray-800 rounded mb-2" />
    <div className="w-32 h-4 bg-gray-800 rounded" />
  </div>
);

const ChartSkeleton = () => (
  <div className="bg-[#161622] rounded-2xl p-6 border border-gray-800 animate-pulse h-72">
    <div className="w-40 h-5 bg-gray-800 rounded mb-6" />
    <div className="h-full bg-gray-800/40 rounded-xl" />
  </div>
);

// --- Custom tooltip ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#161622] border border-gray-700 rounded-xl p-3 shadow-xl text-xs">
        <p className="text-gray-400 mb-1">{label}</p>
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

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'Revenue at Risk', value: `₹${(mockDashboardStats.revenueAtRisk / 100000).toFixed(1)}L`, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10', trend: '+8.2%', trendColor: 'text-rose-400' },
    { label: 'Revenue Recovered', value: `₹${(mockDashboardStats.revenueRecovered / 100000).toFixed(1)}L`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: '+23.5%', trendColor: 'text-emerald-400' },
    { label: 'Recovery Rate', value: `${mockDashboardStats.recoveryRate}%`, icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+4.1%', trendColor: 'text-emerald-400' },
    { label: 'Avg. Recovery Time', value: mockDashboardStats.avgRecoveryTime, icon: Clock, color: 'text-primary', bg: 'bg-primary/10', trend: '-12min', trendColor: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time revenue recovery analytics.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1.5 py-1.5 px-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
            Live
          </Badge>
          <Button variant="outline" size="sm">Last 30 Days</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
          : stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="hover:border-gray-700 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl`}>
                      <Icon size={20} />
                    </div>
                    <span className={`text-xs font-medium ${stat.trendColor} flex items-center gap-1`}>
                      <TrendingUp size={12} /> {stat.trend}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </Card>
              </motion.div>
            );
          })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recovery Trend */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <Card>
              <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" /> Recovery Trend (30d)
              </h3>
              {mockRecoveryTrendData.length === 0 ? (
                <EmptyState title="No trend data" description="Data will appear once you have recovery history." icon={<BarChart2 size={32} />} />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={mockRecoveryTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2e" />
                    <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="recovered" stroke="#7c3aed" strokeWidth={2.5} dot={false} name="Recovered" />
                    <Line type="monotone" dataKey="atRisk" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 4" dot={false} name="At Risk" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card>
          )}
        </div>

        {/* Failure Reasons */}
        <div>
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <Card>
              <h3 className="text-base font-semibold text-white mb-6 flex items-center gap-2">
                <AlertCircle size={18} className="text-rose-500" /> Failure Breakdown
              </h3>
              {mockFailureReasonData.length === 0 ? (
                <EmptyState title="No failures" description="All payments successful." icon={<ShieldCheck size={32} />} />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={mockFailureReasonData} layout="vertical" barSize={12}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="reason" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} tickLine={false} width={90} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#7c3aed" radius={[0, 6, 6, 0]} name="Cases" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* Recent Cases */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Sparkles size={18} className="text-primary" /> Recent Recovery Cases
          </h3>
          <Button variant="ghost" size="sm">View All →</Button>
        </div>
        {mockRecoveryCases.length === 0 ? (
          <EmptyState title="No cases" description="No recovery cases yet." icon={<ShieldCheck size={32} />} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table" aria-label="Recent recovery cases">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Customer', 'Amount', 'Issue', 'AI Confidence', 'Status'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-500 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {mockRecoveryCases.slice(0, 5).map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={c.customer.avatarUrl} alt="" className="w-7 h-7 rounded-full" />
                        <span className="text-gray-200 font-medium">{c.customer.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300 font-mono">₹{c.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-gray-400 max-w-[180px] truncate">{c.failureReason}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-800 rounded-full h-1.5 max-w-[80px]">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${c.aiConfidence}%` }} />
                        </div>
                        <span className="text-gray-400 text-xs">{c.aiConfidence}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
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

      {/* AI Insights Widget */}
      <Card className="bg-primary/5 border-primary/20">
        <div className="flex items-center gap-3 mb-5">
          <BrainCircuit className="text-primary" size={22} />
          <h3 className="text-base font-semibold text-white">AI Recovery Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { n: 1, text: '12 payments failed due to Bank Timeout today. Auto-retry within 2 hours recommended.' },
            { n: 2, text: 'High-value customers respond 40% better to personalized WhatsApp reminders.' },
            { n: 3, text: 'Retrying Insufficient Funds errors after 24 hours has a 75% recovery probability.' },
          ].map(({ n, text }) => (
            <div key={n} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm shrink-0">{n}</div>
              <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
