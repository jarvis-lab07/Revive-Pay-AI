export interface Merchant {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

export interface RecoveryCase {
  id: string;
  customerId: string;
  customer: Customer;
  amount: number;
  currency: string;
  failureReason: string;
  status: 'pending' | 'recovered' | 'failed';
  aiConfidence: number;
  recommendedAction: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  eventType: string;
  aiExplanation: string;
  status: 'success' | 'warning' | 'error';
  merchantApproved: boolean;
}

export interface DashboardStats {
  revenueAtRisk: number;
  revenueRecovered: number;
  recoverySuccessRate: number;
  pendingCases: number;
}
