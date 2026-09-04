import express, { Router } from 'express';
import { RazorpayController } from '../controllers/razorpay';
import { authenticate } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiter for order creation
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: { success: false, message: 'Too many orders created from this IP, please try again after 15 minutes' }
});

router.post('/create-order', authenticate, orderLimiter, RazorpayController.createOrder);
router.post('/verify', authenticate, RazorpayController.verifyPayment);

// Webhook doesn't use authentication, but uses signature validation
// We need rawBody for signature verification, handled in app.ts
router.post('/webhook', RazorpayController.webhook);

export default router;
