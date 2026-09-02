-- Migration: Add Razorpay Orders and Payments

CREATE TYPE razorpay_payment_status_enum AS ENUM ('CREATED', 'PAID', 'FAILED', 'EXPIRED');

CREATE TABLE razorpay_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recovery_case_id UUID NOT NULL REFERENCES recovery_cases(id) ON DELETE CASCADE,
    razorpay_order_id VARCHAR(255) UNIQUE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50) DEFAULT 'created',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE razorpay_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    razorpay_payment_id VARCHAR(255) UNIQUE NOT NULL,
    razorpay_order_id VARCHAR(255) NOT NULL REFERENCES razorpay_orders(razorpay_order_id) ON DELETE CASCADE,
    recovery_case_id UUID NOT NULL REFERENCES recovery_cases(id) ON DELETE CASCADE,
    status razorpay_payment_status_enum NOT NULL,
    method VARCHAR(50),
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
