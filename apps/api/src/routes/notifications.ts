import { Router } from 'express';
import { NotificationController } from '../controllers/notifications';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', NotificationController.getNotifications);
router.patch('/:id/read', NotificationController.markAsRead);
router.post('/test', NotificationController.createTest);

export default router;
