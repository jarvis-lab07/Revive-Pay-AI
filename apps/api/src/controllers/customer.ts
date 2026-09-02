import { Response, NextFunction } from 'express';
import { CustomerService } from '../services/customer';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export class CustomerController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await CustomerService.getAll(req.user!.id);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = await CustomerService.getById(req.user!.id, id);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }
}
