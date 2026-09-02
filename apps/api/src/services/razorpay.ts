import { razorpay } from '../config/razorpay';
import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../utils/errors';
import { verifySignature, verifyWebhookSignature } from '../utils/signature';
import { env } from '../config/env';

export class RecoveryPaymentService {
  static async createRetryOrder(merchantId: string, recoveryCaseId: string) {
    // 1. Fetch recovery case
    const { data: recoveryCase, error: caseError } = await supabaseAdmin
      .from('recovery_cases')
      .select(`*, payment_events!inner(merchant_id, amount, currency)`)
      .eq('id', recoveryCaseId)
      .eq('payment_events.merchant_id', merchantId)
      .single();

    if (caseError || !recoveryCase) {
      throw new AppError('Recovery case not found', 404);
    }

    if (recoveryCase.recovery_status === 'RECOVERED') {
      throw new AppError('Case is already recovered', 400);
    }

    const amountInPaise = Math.round(Number(recoveryCase.payment_events.amount) * 100);

    // 2. Create Razorpay Test Order
    const orderOptions = {
      amount: amountInPaise,
      currency: recoveryCase.payment_events.currency,
      receipt: `rc_${recoveryCaseId}`,
      notes: {
        recoveryCaseId,
        merchantId
      }
    };

    const rzpOrder = await razorpay.orders.create(orderOptions);

    // 3. Save order in Supabase
    await supabaseAdmin.from('razorpay_orders').insert({
      recovery_case_id: recoveryCaseId,
      razorpay_order_id: rzpOrder.id,
      amount: Number(recoveryCase.payment_events.amount),
      currency: rzpOrder.currency,
      status: 'created'
    });

    // 4. Create audit log
    await supabaseAdmin.from('audit_logs').insert({
      merchant_id: merchantId,
      recovery_case_id: recoveryCaseId,
      event: 'PAYMENT_RETRY_CREATED',
      explanation: 'Created a Razorpay checkout order for retry.',
      actor: 'SYSTEM',
      metadata: { razorpay_order_id: rzpOrder.id }
    });

    return {
      orderId: rzpOrder.id,
      amount: orderOptions.amount,
      currency: orderOptions.currency,
      keyId: env.RAZORPAY_KEY_ID
    };
  }

  static async verifyPayment(merchantId: string, razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string) {
    const isValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, env.RAZORPAY_KEY_SECRET);
    
    if (!isValid) {
      throw new AppError('Invalid payment signature', 400);
    }

    // Fetch order to get recovery_case_id
    const { data: order, error: orderError } = await supabaseAdmin
      .from('razorpay_orders')
      .select('recovery_case_id')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    if (orderError || !order) {
      throw new AppError('Order not found', 404);
    }

    const recoveryCaseId = order.recovery_case_id;

    // Update payment table
    await supabaseAdmin.from('razorpay_payments').upsert({
      razorpay_payment_id,
      razorpay_order_id,
      recovery_case_id: recoveryCaseId,
      status: 'PAID',
    });

    // Mark recovery case RECOVERED
    await supabaseAdmin.from('recovery_cases')
      .update({ recovery_status: 'RECOVERED', updated_at: new Date().toISOString() })
      .eq('id', recoveryCaseId);

    // Insert audit log
    await supabaseAdmin.from('audit_logs').insert({
      merchant_id: merchantId,
      recovery_case_id: recoveryCaseId,
      event: 'PAYMENT_CAPTURED',
      explanation: 'Payment was successfully recovered and verified.',
      actor: 'SYSTEM',
      metadata: { razorpay_order_id, razorpay_payment_id, verified: true }
    });

    return { success: true, message: 'Payment verified and case recovered' };
  }

  static async processWebhook(payload: any, signature: string, rawBody: string) {
    const isValid = verifyWebhookSignature(rawBody, signature, env.RAZORPAY_WEBHOOK_SECRET);
    if (!isValid) {
      throw new AppError('Invalid webhook signature', 400);
    }

    const event = payload.event;
    const paymentEntity = payload.payload.payment?.entity;
    const orderEntity = payload.payload.order?.entity;
    
    // Notes contain metadata we set during order creation
    const notes = paymentEntity?.notes || orderEntity?.notes;
    const recoveryCaseId = notes?.recoveryCaseId;
    const merchantId = notes?.merchantId;

    if (!recoveryCaseId || !merchantId) {
      // Ignore webhooks not originating from our system
      return;
    }

    switch (event) {
      case 'payment.captured':
        await supabaseAdmin.from('razorpay_payments').upsert({
          razorpay_payment_id: paymentEntity.id,
          razorpay_order_id: paymentEntity.order_id,
          recovery_case_id: recoveryCaseId,
          status: 'PAID',
          method: paymentEntity.method,
        });

        await supabaseAdmin.from('recovery_cases')
          .update({ recovery_status: 'RECOVERED', updated_at: new Date().toISOString() })
          .eq('id', recoveryCaseId);

        await supabaseAdmin.from('audit_logs').insert({
          merchant_id: merchantId,
          recovery_case_id: recoveryCaseId,
          event: 'WEBHOOK_RECEIVED',
          explanation: 'Webhook confirmed payment captured.',
          actor: 'SYSTEM',
          metadata: { razorpay_payment_id: paymentEntity.id, event }
        });
        break;

      case 'payment.failed':
        await supabaseAdmin.from('razorpay_payments').upsert({
          razorpay_payment_id: paymentEntity.id,
          razorpay_order_id: paymentEntity.order_id,
          recovery_case_id: recoveryCaseId,
          status: 'FAILED',
          method: paymentEntity.method,
          failure_reason: paymentEntity.error_description
        });

        await supabaseAdmin.from('audit_logs').insert({
          merchant_id: merchantId,
          recovery_case_id: recoveryCaseId,
          event: 'PAYMENT_FAILED',
          explanation: `Payment retry failed: ${paymentEntity.error_description}`,
          actor: 'SYSTEM',
          metadata: { razorpay_payment_id: paymentEntity.id, event, error: paymentEntity.error_description }
        });
        break;

      // Handle other necessary events
    }
  }
}
