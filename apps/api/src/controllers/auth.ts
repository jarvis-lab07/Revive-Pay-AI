import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, businessName, phone } = req.body;
      const data = await AuthService.signup(email, password, businessName, phone);
      sendSuccess(res, data, 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const data = await AuthService.login(email, password);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1] || '';
      await AuthService.logout(token);
      sendSuccess(res, { message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AuthService.getProfile(req.user!.id);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }
}
