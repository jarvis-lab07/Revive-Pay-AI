import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../utils/errors';

export class DashboardService {
  static async getDashboardData(merchantId: string) {
    // Fetch all needed aggregates
    const { data: paymentEvents, error: paymentError } = await supabaseAdmin
      .from('payment_events')
      .select('amount, status')
      .eq('merchant_id', merchantId);

    if (paymentError) throw new AppError('Failed to fetch dashboard data', 500);

    const { data: recoveries, error: recoveryError } = await supabaseAdmin
      .from('recovery_cases')
      .select('recovery_status, payment_events!inner(merchant_id, amount)')
      .eq('payment_events.merchant_id', merchantId);

    if (recoveryError) throw new AppError('Failed to fetch recovery data', 500);

    let revenueAtRisk = 0;
    let recoveredRevenue = 0;
    let pendingRecoveries = 0;
    let successfulRecoveries = 0;

    paymentEvents.forEach(pe => {
      if (pe.status === 'FAILED' || pe.status === 'ABANDONED') {
        revenueAtRisk += Number(pe.amount);
      }
    });

    recoveries.forEach((r: any) => {
      if (r.recovery_status === 'RECOVERED') {
        recoveredRevenue += Number(r.payment_events.amount);
        successfulRecoveries++;
      } else if (r.recovery_status === 'OPEN' || r.recovery_status === 'IN_PROGRESS') {
        pendingRecoveries++;
      }
    });

    const totalCases = recoveries.length;
    const recoveryRate = totalCases > 0 ? Math.round((successfulRecoveries / totalCases) * 100) : 0;

    return {
      revenueAtRisk,
      recoveredRevenue,
      pendingRecoveries,
      recoveryRate,
      issueBreakdown: [
        { name: 'Failed Payments', count: paymentEvents.filter(p => p.status === 'FAILED').length },
        { name: 'Abandoned', count: paymentEvents.filter(p => p.status === 'ABANDONED').length }
      ],
      recentCases: [] // Can be populated with actual recent rows if needed
    };
  }
}
