const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const AIService = {
  analyzeCase: async (recoveryCaseId: string) => {
    // Mocking API call for demonstration
    console.log(`[Mock API] Analyzing case: ${recoveryCaseId}`);
    return {
      success: true,
      data: {
        reason: 'Payment failed due to insufficient funds detected from previous patterns.',
        confidence: 85,
        severity: 'HIGH',
        recommendedAction: 'RETRY',
        explanation: 'Customer typically deposits funds within 24 hours of failure. Retry is highly likely to succeed.',
        customerMessage: 'Hi there! It looks like your payment of ₹5000 failed. We will automatically retry it tomorrow.',
        retryWindowMinutes: 1440,
        requiresMerchantApproval: true
      }
    };

    /* Real implementation:
    const response = await fetch(`${API_BASE}/ai/analyze/${recoveryCaseId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('AI analysis failed');
    return response.json();
    */
  },

  approveAction: async (recoveryCaseId: string, approved: boolean, actionDetails?: any) => {
    console.log(`[Mock API] Approving action for case: ${recoveryCaseId}, Approved: ${approved}`);
    return { success: true, message: 'Action status updated' };

    /* Real implementation:
    const response = await fetch(`${API_BASE}/ai/approve/${recoveryCaseId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ approved, actionDetails })
    });
    if (!response.ok) throw new Error('Failed to approve action');
    return response.json();
    */
  }
};
