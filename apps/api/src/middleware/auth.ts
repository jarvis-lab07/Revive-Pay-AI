import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/errors';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication token is missing or invalid', 401);
    }

    const token = authHeader.split(' ')[1];
    
    // In a real app using Supabase Auth, you might verify the Supabase JWT
    // Here we're verifying our own JWT for simplicity and flexibility
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string, email: string };
    
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    next(new AppError('Unauthorized', 401));
  }
};
