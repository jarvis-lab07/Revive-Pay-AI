import { Router } from 'express';
import { CustomerController } from '../controllers/customer';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', CustomerController.getAll);
router.get('/:id', CustomerController.getById);

export default router;
