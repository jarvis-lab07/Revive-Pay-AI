import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../utils/errors';

export class AuditService {
  static async getLogs(merchantId: string, limit = 50, offset = 0) {
    const { data, error, count } = await supabaseAdmin
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new AppError('Failed to fetch audit logs', 500);
    return { data, total: count };
  }
}
