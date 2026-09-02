import { Request, Response, NextFunction } from 'express';
import { RecoveryPaymentService } from '../services/razorpay';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export class RazorpayController {
  static async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { recoveryCaseId } = req.body;
      const data = await RecoveryPaymentService.createRetryOrder(req.user!.id, recoveryCaseId);
      sendSuccess(res, data, 201);
    } catch (error) {
      next(error);
    }
  }

  static async verifyPayment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const data = await RecoveryPaymentService.verifyPayment(req.user!.id, razorpay_order_id, razorpay_payment_id, razorpay_signature);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      // We need the raw body for signature verification. Express JSON parser usually overwrites it.
      // We must configure express to save the raw body on req.rawBody or use express.raw() for this route.
      // Assuming it's attached as req.rawBody in real app, or we stringify req.body for this example
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);
      
      await RecoveryPaymentService.processWebhook(req.body, signature, rawBody);
      res.status(200).send('OK');
    } catch (error) {
      // Return 200 even on error to prevent Razorpay from retrying indefinitely for bad signatures, 
      // but in standard practice we can return 400 if signature fails.
      next(error);
    }
  }
}
