import { Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export class DashboardController {
  static async getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await DashboardService.getDashboardData(req.user!.id);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }
}
