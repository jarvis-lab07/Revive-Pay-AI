import { AIResponse } from './parser';

export const evaluateAIResponse = (response: AIResponse, settings: any): AIResponse => {
  let evaluated = { ...response };

  // Rule 1: Enforce Merchant Approval for sensitive actions
  const sensitiveActions = ['RETRY', 'COUPON', 'FOLLOW_UP'];
  if (sensitiveActions.includes(evaluated.recommendedAction)) {
    evaluated.requiresMerchantApproval = true;
  }

  // Rule 2: Ensure confidence constraints based on severity (safety check)
  if (evaluated.confidence < 50 && evaluated.recommendedAction !== 'MANUAL_REVIEW') {
    evaluated.recommendedAction = 'MANUAL_REVIEW';
    evaluated.requiresMerchantApproval = true;
    evaluated.explanation = 'Confidence too low to auto-recommend action. Manual review required.';
  }

  return evaluated;
};
