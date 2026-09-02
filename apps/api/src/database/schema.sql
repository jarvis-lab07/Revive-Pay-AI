-- Enable pgcrypto for UUID generation if not enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enums
CREATE TYPE payment_status_enum AS ENUM ('SUCCESS', 'FAILED', 'ABANDONED', 'PENDING');
CREATE TYPE ai_status_enum AS ENUM ('PENDING', 'ANALYZED', 'ACTION_SENT');
CREATE TYPE recovery_status_enum AS ENUM ('OPEN', 'IN_PROGRESS', 'RECOVERED', 'FAILED');
CREATE TYPE action_type_enum AS ENUM ('RETRY', 'REMINDER', 'COUPON', 'VOICE_CALL', 'FOLLOW_UP');
CREATE TYPE actor_enum AS ENUM ('AI', 'MERCHANT', 'SYSTEM');

-- Tables
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    city VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status payment_status_enum NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recovery_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_event_id UUID NOT NULL REFERENCES payment_events(id) ON DELETE CASCADE,
    risk_level VARCHAR(50),
    ai_status ai_status_enum DEFAULT 'PENDING',
    recovery_status recovery_status_enum DEFAULT 'OPEN',
    confidence_score DECIMAL(5, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE recovery_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recovery_case_id UUID NOT NULL REFERENCES recovery_cases(id) ON DELETE CASCADE,
    action_type action_type_enum NOT NULL,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    recovery_case_id UUID REFERENCES recovery_cases(id) ON DELETE SET NULL,
    event VARCHAR(255) NOT NULL,
    explanation TEXT,
    actor actor_enum NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE merchant_settings (
    merchant_id UUID PRIMARY KEY REFERENCES merchants(id) ON DELETE CASCADE,
    max_retry_attempts INT DEFAULT 3,
    coupon_limit_percent DECIMAL(5, 2) DEFAULT 10.00,
    auto_retry_enabled BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
