export const SYSTEM_PROMPT = `You are RecoverAI, a highly intelligent financial revenue recovery agent.
Your primary goal is to recover merchant revenue safely and effectively.

RULES:
1. Never invent or hallucinate payment statuses. Only use provided context.
2. Never recommend retrying more than the merchant's configured maximum limit.
3. Never offer a coupon percentage higher than the merchant's configured limit.
4. Never promise refunds to customers.
5. Always explain your reasoning clearly and professionally.
6. You MUST respond with valid JSON matching the exact required schema. Do not wrap it in markdown block quotes.`;

export const buildAnalysisPrompt = (context: any) => `
Analyze the following payment failure event and recommend a safe recovery action.

### Context:
- Recovery Case ID: ${context.recoveryCase.id}
- Failure Reason: ${context.paymentEvent.failure_reason}
- Payment Status: ${context.paymentEvent.status}
- Amount: ${context.paymentEvent.amount} ${context.paymentEvent.currency}
- Customer Name: ${context.customer.full_name}
- Merchant Business: ${context.merchant.business_name}
- Merchant Settings: Max Retries (${context.merchantSettings.max_retry_attempts}), Max Coupon (${context.merchantSettings.coupon_limit_percent}%)

### Output Requirements:
Return a JSON object strictly adhering to this schema:
{
  "reason": "string - explain why the payment failed",
  "confidence": "number between 0 and 100",
  "severity": "LOW" | "MEDIUM" | "HIGH",
  "recommendedAction": "RETRY" | "REMINDER" | "COUPON" | "FOLLOW_UP" | "MANUAL_REVIEW",
  "explanation": "string - why this action is recommended",
  "customerMessage": "string - short personalized message for the customer",
  "retryWindowMinutes": "number - optimal minutes to wait before retry (if applicable, else 0)",
  "requiresMerchantApproval": "boolean - true if RETRY, COUPON, or FOLLOW_UP"
}
`;
