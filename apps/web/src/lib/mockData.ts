import { DashboardStats, RecoveryCase, AuditLog } from '../types';

export const mockDashboardStats: DashboardStats = {
  revenueAtRisk: 48200,
  revenueRecovered: 22350,
  recoverySuccessRate: 63,
  pendingCases: 14,
  avgRecoveryTime: '2.5h',
};

export type CustomerRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  lifetimeValue: number;
  openCases: number;
  lastPaymentAt: string;
  risk: 'low' | 'medium' | 'high';
  status: 'active' | 'at_risk' | 'recovered';
};

export const mockCustomers: CustomerRecord[] = [
  { id: 'c1', name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 98765 43210', avatarUrl: 'https://i.pravatar.cc/150?u=c1', lifetimeValue: 84200, openCases: 1, lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), risk: 'medium', status: 'at_risk' },
  { id: 'c2', name: 'Priya Patel', email: 'priya.p@example.com', phone: '+91 98201 11223', avatarUrl: 'https://i.pravatar.cc/150?u=c2', lifetimeValue: 156400, openCases: 1, lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), risk: 'high', status: 'at_risk' },
  { id: 'c3', name: 'Amit Singh', email: 'amit.s@example.com', phone: '+91 99887 66554', avatarUrl: 'https://i.pravatar.cc/150?u=c3', lifetimeValue: 42100, openCases: 0, lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), risk: 'low', status: 'recovered' },
  { id: 'c4', name: 'Neha Gupta', email: 'neha.g@example.com', phone: '+91 97654 22110', avatarUrl: 'https://i.pravatar.cc/150?u=c4', lifetimeValue: 67800, openCases: 1, lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), risk: 'medium', status: 'at_risk' },
  { id: 'c5', name: 'Vikram Reddy', email: 'vikram.r@example.com', phone: '+91 90011 22334', avatarUrl: 'https://i.pravatar.cc/150?u=c5', lifetimeValue: 91200, openCases: 1, lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), risk: 'medium', status: 'at_risk' },
  { id: 'c6', name: 'Anjali Desai', email: 'anjali.d@example.com', phone: '+91 98123 44556', avatarUrl: 'https://i.pravatar.cc/150?u=c6', lifetimeValue: 210500, openCases: 0, lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), risk: 'high', status: 'active' },
  { id: 'c7', name: 'Rohan Kumar', email: 'rohan.k@example.com', phone: '+91 98989 12121', avatarUrl: 'https://i.pravatar.cc/150?u=c7', lifetimeValue: 18500, openCases: 1, lastPaymentAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), risk: 'low', status: 'at_risk' },
  { id: 'c8', name: 'Sneha Joshi', email: 'sneha.j@example.com', phone: '+91 97000 33445', avatarUrl: 'https://i.pravatar.cc/150?u=c8', lifetimeValue: 55400, openCases: 1, lastPaymentAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), risk: 'low', status: 'active' },
];

export const mockRecoveryCases: RecoveryCase[] = [
  {
    id: 'rc1',
    customerId: 'c1',
    customer: mockCustomers[0],
    amount: 5000,
    currency: 'INR',
    failureReason: 'Insufficient Funds',
    status: 'pending',
    aiConfidence: 92,
    recommendedAction: 'Send Reminder with Partial Payment Option',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'rc2',
    customerId: 'c2',
    customer: mockCustomers[1],
    amount: 12000,
    currency: 'INR',
    failureReason: 'Card Expired',
    status: 'pending',
    aiConfidence: 85,
    recommendedAction: 'Prompt to Update Payment Method',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'rc3',
    customerId: 'c3',
    customer: mockCustomers[2],
    amount: 3500,
    currency: 'INR',
    failureReason: 'Bank Network Timeout',
    status: 'recovered',
    aiConfidence: 98,
    recommendedAction: 'Auto-Retry in 2 Hours',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: 'rc4',
    customerId: 'c4',
    customer: mockCustomers[3],
    amount: 8000,
    currency: 'INR',
    failureReason: 'Abandoned Checkout',
    status: 'pending',
    aiConfidence: 75,
    recommendedAction: 'Send 10% Discount Offer',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'rc5',
    customerId: 'c5',
    customer: mockCustomers[4],
    amount: 4500,
    currency: 'INR',
    failureReason: 'Authentication Failed',
    status: 'pending',
    aiConfidence: 88,
    recommendedAction: 'Request Manual UPI Verification',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'rc6',
    customerId: 'c6',
    customer: mockCustomers[5],
    amount: 15000,
    currency: 'INR',
    failureReason: 'Exceeds Credit Limit',
    status: 'failed',
    aiConfidence: 60,
    recommendedAction: 'Suggest EMI Options',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: 'rc7',
    customerId: 'c7',
    customer: mockCustomers[6],
    amount: 2500,
    currency: 'INR',
    failureReason: 'Abandoned Checkout',
    status: 'pending',
    aiConfidence: 82,
    recommendedAction: 'Send Abandoned Cart Email',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'rc8',
    customerId: 'c8',
    customer: mockCustomers[7],
    amount: 6000,
    currency: 'INR',
    failureReason: 'Subscription Renewal Failed',
    status: 'pending',
    aiConfidence: 95,
    recommendedAction: 'Grace Period Extension Notice',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'al1',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    eventType: 'AI Recommendation Generated',
    aiExplanation: 'Detected insufficient funds pattern. Suggested partial payment.',
    status: 'success',
    merchantApproved: true,
  },
  {
    id: 'al2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    eventType: 'Auto-Retry Triggered',
    aiExplanation: 'Bank timeout error detected. Scheduled retry for optimal success window.',
    status: 'success',
    merchantApproved: true,
  },
  {
    id: 'al3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    eventType: 'Recovery Email Sent',
    aiExplanation: 'Abandoned checkout for high-value cart. Included 10% discount.',
    status: 'success',
    merchantApproved: false,
  },
  {
    id: 'al4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    eventType: 'Failed Payment Detected',
    aiExplanation: 'Card expired error. Generating update payment method link.',
    status: 'warning',
    merchantApproved: false,
  },
  {
    id: 'al5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    eventType: 'Webhook Sync Error',
    aiExplanation: 'Failed to receive payload from Razorpay webhook endpoint.',
    status: 'error',
    merchantApproved: false,
  },
];

export const mockChartDataLine = [
  { name: 'Mon', risk: 4000, recovered: 2400 },
  { name: 'Tue', risk: 3000, recovered: 1398 },
  { name: 'Wed', risk: 2000, recovered: 9800 },
  { name: 'Thu', risk: 2780, recovered: 3908 },
  { name: 'Fri', risk: 1890, recovered: 4800 },
  { name: 'Sat', risk: 2390, recovered: 3800 },
  { name: 'Sun', risk: 3490, recovered: 4300 },
];

export const mockChartDataBar = [
  { name: 'Failed Payments', count: 120 },
  { name: 'Abandoned', count: 85 },
  { name: 'Sub Failed', count: 40 },
  { name: 'Overdue', count: 20 },
];

export const mockChartDataPie = [
  { name: 'Recovered', value: 63, fill: 'var(--color-primary)' },
  { name: 'Failed', value: 15, fill: '#ef4444' },
  { name: 'Pending', value: 22, fill: 'var(--color-accent)' },
];

export const mockRecoveryTrendData = mockChartDataLine.map(d => ({ date: d.name, atRisk: d.risk, recovered: d.recovered }));
export const mockFailureReasonData = mockChartDataBar.map(d => ({ reason: d.name, count: d.count }));
