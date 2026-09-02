import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', DashboardController.getDashboard);

export default router;
