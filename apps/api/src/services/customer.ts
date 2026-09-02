import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../utils/errors';

export class CustomerService {
  static async getAll(merchantId: string) {
    const { data, error } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('merchant_id', merchantId);

    if (error) throw new AppError('Failed to fetch customers', 500);
    return data;
  }

  static async getById(merchantId: string, customerId: string) {
    const { data, error } = await supabaseAdmin
      .from('customers')
      .select(`
        *,
        payment_events(*)
      `)
      .eq('id', customerId)
      .eq('merchant_id', merchantId)
      .single();

    if (error || !data) throw new AppError('Customer not found', 404);
    return data;
  }
}
