import { Response, NextFunction } from 'express';
import { RecoveryAgentService } from '../ai/recoveryAgent';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export class AIController {
  static async analyze(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { recoveryCaseId } = req.params;
      const data = await RecoveryAgentService.analyzeCase(req.user!.id, recoveryCaseId);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }

  static async approve(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { recoveryCaseId } = req.params;
      const { approved, actionDetails } = req.body;
      const data = await RecoveryAgentService.approveAction(req.user!.id, recoveryCaseId, approved, actionDetails);
      sendSuccess(res, data);
    } catch (error) {
      next(error);
    }
  }
}
