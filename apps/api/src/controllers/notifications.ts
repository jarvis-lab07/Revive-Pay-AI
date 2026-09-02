import { Response, NextFunction } from 'express';
import { NotificationService } from '../services/notifications';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export class NotificationController {
  static async getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const data = await NotificationService.getNotifications(req.user!.id, limit, offset);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await NotificationService.markAsRead(req.user!.id, id);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async createTest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await NotificationService.createNotification(
        req.user!.id,
        'SYSTEM_ALERT',
        'Test Notification',
        'This is a generated test notification.'
      );
      sendSuccess(res, data, 201);
    } catch (error) {
      next(error);
    }
  }
}
