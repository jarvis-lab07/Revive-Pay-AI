import { Router } from 'express';
import { AIController } from '../controllers/ai';
import { authenticate } from '../middleware/auth';
import { z } from 'zod';
import { validate } from '../middleware/validate';

const router = Router();

router.use(authenticate);

const approveSchema = z.object({
  body: z.object({
    approved: z.boolean(),
    actionDetails: z.any().optional()
  })
});

router.post('/analyze/:recoveryCaseId', AIController.analyze);
router.post('/approve/:recoveryCaseId', validate(approveSchema), AIController.approve);

export default router;
