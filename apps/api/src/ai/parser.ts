import { z } from 'zod';

export const AIResponseSchema = z.object({
  reason: z.string(),
  confidence: z.number().min(0).max(100),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  recommendedAction: z.enum(['RETRY', 'REMINDER', 'COUPON', 'FOLLOW_UP', 'MANUAL_REVIEW']),
  explanation: z.string(),
  customerMessage: z.string(),
  retryWindowMinutes: z.number(),
  requiresMerchantApproval: z.boolean(),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

export const parseAIResponse = (jsonString: string): AIResponse => {
  try {
    const data = JSON.parse(jsonString);
    return AIResponseSchema.parse(data);
  } catch (error) {
    throw new Error('Failed to parse or validate AI JSON response');
  }
};
