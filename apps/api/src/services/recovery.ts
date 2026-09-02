import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../utils/errors';

export class RecoveryService {
  static async getAllCases(merchantId: string) {
    const { data, error } = await supabaseAdmin
      .from('recovery_cases')
      .select(`
        *,
        payment_events!inner(
          merchant_id, amount, currency, failure_reason, status,
          customers (
            full_name, email, phone
          )
        )
      `)
      .eq('payment_events.merchant_id', merchantId);

    if (error) throw new AppError('Failed to fetch recovery cases', 500);
    return data;
  }

  static async getCaseById(merchantId: string, caseId: string) {
    const { data, error } = await supabaseAdmin
      .from('recovery_cases')
      .select(`
        *,
        payment_events!inner(
          merchant_id, amount, currency, failure_reason,
          customers (*)
        ),
        recovery_actions(*),
        audit_logs(*)
      `)
      .eq('id', caseId)
      .eq('payment_events.merchant_id', merchantId)
      .single();

    if (error || !data) throw new AppError('Recovery case not found', 404);
    return data;
  }

  static async updateStatus(merchantId: string, caseId: string, status: string) {
    const { data, error } = await supabaseAdmin
      .from('recovery_cases')
      .update({ recovery_status: status, updated_at: new Date().toISOString() })
      .eq('id', caseId)
      .select()
      .single();

    if (error) throw new AppError('Failed to update status', 500);

    // Create Audit Log
    await supabaseAdmin.from('audit_logs').insert({
      merchant_id: merchantId,
      recovery_case_id: caseId,
      event: 'Status Updated',
      explanation: `Recovery status changed to ${status}`,
      actor: 'MERCHANT'
    });

    return data;
  }

  static async addAction(merchantId: string, caseId: string, actionType: string, message?: string) {
    const { data, error } = await supabaseAdmin
      .from('recovery_actions')
      .insert({
        recovery_case_id: caseId,
        action_type: actionType,
        message
      })
      .select()
      .single();

    if (error) throw new AppError('Failed to add action', 500);

    await supabaseAdmin.from('audit_logs').insert({
      merchant_id: merchantId,
      recovery_case_id: caseId,
      event: 'Action Performed',
      explanation: `Performed action: ${actionType}`,
      actor: 'MERCHANT'
    });

    return data;
  }
}
