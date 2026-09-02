import { Response, NextFunction } from 'express';
import { RecoveryService } from '../services/recovery';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export class RecoveryController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await RecoveryService.getAllCases(req.user!.id);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await RecoveryService.getCaseById(req.user!.id, id);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const data = await RecoveryService.updateStatus(req.user!.id, id, status);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async addAction(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { actionType, message } = req.body;
      const data = await RecoveryService.addAction(req.user!.id, id, actionType, message);
      sendSuccess(res, data, 201);
    } catch (error) {
      next(error);
    }
  }
}
