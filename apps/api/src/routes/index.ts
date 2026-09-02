import { Router } from 'express';
import authRoutes from './auth';
import dashboardRoutes from './dashboard';
import recoveryRoutes from './recovery';
import customerRoutes from './customer';
import auditRoutes from './audit';
import razorpayRoutes from './razorpay';
import aiRoutes from './ai';
import notificationRoutes from './notifications';
import { healthCheck } from '../controllers/health';

const router = Router();

router.get('/health', healthCheck);

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/recovery', recoveryRoutes);
router.use('/customers', customerRoutes);
router.use('/audit', auditRoutes);
router.use('/razorpay', razorpayRoutes);
router.use('/ai', aiRoutes);
router.use('/notifications', notificationRoutes);

export default router;
