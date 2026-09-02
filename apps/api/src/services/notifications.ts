import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../utils/errors';

export class NotificationService {
  static async getNotifications(merchantId: string, limit = 20, offset = 0) {
    const { data, error, count } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new AppError('Failed to fetch notifications', 500);
    return { data, total: count };
  }

  static async markAsRead(merchantId: string, notificationId: string) {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('merchant_id', merchantId)
      .select()
      .single();

    if (error) throw new AppError('Failed to update notification', 500);
    return data;
  }

  static async createNotification(
    merchantId: string,
    type: string,
    title: string,
    message: string,
    recoveryCaseId?: string
  ) {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert({
        merchant_id: merchantId,
        recovery_case_id: recoveryCaseId,
        type,
        title,
        message
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create notification', error);
      return null; // Fire and forget pattern for notifications
    }

    // Insert Audit log for notification creation
    await supabaseAdmin.from('audit_logs').insert({
      merchant_id: merchantId,
      recovery_case_id: recoveryCaseId,
      event: 'NOTIFICATION_CREATED',
      explanation: `System generated notification: ${title}`,
      actor: 'SYSTEM',
      metadata: { notification_id: data.id, type }
    });

    return data;
  }
}
