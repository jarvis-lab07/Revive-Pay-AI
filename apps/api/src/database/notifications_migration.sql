-- Migration: Add Notifications

CREATE TYPE notification_type_enum AS ENUM ('PAYMENT_RECOVERED', 'APPROVAL_REQUIRED', 'RETRY_FAILED', 'AI_CONFIDENCE_LOW', 'WEBHOOK_PROCESSED', 'SYSTEM_ALERT');

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    recovery_case_id UUID REFERENCES recovery_cases(id) ON DELETE CASCADE,
    type notification_type_enum NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
