import { z } from 'zod';

export const updateRecoveryStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: z.enum(['OPEN', 'IN_PROGRESS', 'RECOVERED', 'FAILED']),
  }),
});

export const addRecoveryActionSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    actionType: z.enum(['RETRY', 'REMINDER', 'COUPON', 'VOICE_CALL', 'FOLLOW_UP']),
    message: z.string().optional(),
  }),
});
