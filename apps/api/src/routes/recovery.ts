import { Router } from 'express';
import { RecoveryController } from '../controllers/recovery';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateRecoveryStatusSchema, addRecoveryActionSchema } from '../validators/recovery';

const router = Router();

router.use(authenticate);

router.get('/', RecoveryController.getAll);
router.get('/:id', RecoveryController.getById);
router.patch('/:id/status', validate(updateRecoveryStatusSchema), RecoveryController.updateStatus);
router.post('/:id/action', validate(addRecoveryActionSchema), RecoveryController.addAction);

export default router;
