import { Router } from 'express';
import { AuditController } from '../controllers/audit';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/', AuditController.getLogs);

export default router;
