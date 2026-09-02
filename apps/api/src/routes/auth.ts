import { Router } from 'express';
import { AuthController } from '../controllers/auth';
import { validate } from '../middleware/validate';
import { signupSchema, loginSchema } from '../validators/auth';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/signup', validate(signupSchema), AuthController.signup);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/logout', authenticate, AuthController.logout);
router.get('/profile', authenticate, AuthController.getProfile);

export default router;
