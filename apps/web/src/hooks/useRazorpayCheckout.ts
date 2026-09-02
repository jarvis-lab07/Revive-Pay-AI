import { useState, useCallback } from 'react';
import { RazorpayService } from '../services/razorpay';
import { useQueryClient } from '@tanstack/react-query';

interface RazorpayOptions {
  onSuccess: (paymentId: string) => void;
  onError: (error: any) => void;
}

export const useRazorpayCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const openCheckout = useCallback(async (recoveryCaseId: string, options: RazorpayOptions) => {
    setIsLoading(true);
    try {
      // 1. Create order on backend
      const { data: order } = await RazorpayService.createRetryOrder(recoveryCaseId);

      // 2. Configure Razorpay options
      const rzpOptions = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'RecoverAI Demo',
        description: 'Payment Recovery',
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify payment on backend
            await RazorpayService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            
            // Invalidate queries to refresh dashboard stats
            queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
            queryClient.invalidateQueries({ queryKey: ['recoveryCases'] });
            
            options.onSuccess(response.razorpay_payment_id);
          } catch (error) {
            options.onError(error);
          }
        },
        prefill: {
          name: 'Demo Customer',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#7c3aed' // Primary color
        }
      };

      // 3. Open Razorpay Checkout modal
      // @ts-ignore - Razorpay is loaded globally via script tag in index.html
      const rzp = new window.Razorpay(rzpOptions);
      
      rzp.on('payment.failed', function (response: any) {
        options.onError(response.error);
      });

      rzp.open();

    } catch (error) {
      options.onError(error);
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  return { openCheckout, isLoading };
};
