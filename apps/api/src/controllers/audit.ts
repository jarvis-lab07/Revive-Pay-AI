import { Response, NextFunction } from 'express';
import { AuditService } from '../services/audit';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export class AuditController {
  static async getLogs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const data = await AuditService.getLogs(req.user!.id, limit, offset);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }
}
