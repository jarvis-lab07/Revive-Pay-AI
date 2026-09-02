-- Clear existing data
TRUNCATE TABLE merchants CASCADE;

-- Insert Merchant
INSERT INTO merchants (id, business_name, email, phone) 
VALUES ('11111111-1111-1111-1111-111111111111', 'Acme E-Commerce', 'admin@acme.in', '+919876543210');

-- Insert Settings
INSERT INTO merchant_settings (merchant_id, max_retry_attempts, coupon_limit_percent, auto_retry_enabled)
VALUES ('11111111-1111-1111-1111-111111111111', 3, 15.00, TRUE);

-- Insert Customers
INSERT INTO customers (id, merchant_id, full_name, email, phone, city) VALUES 
('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Rahul Sharma', 'rahul@example.com', '+919800000001', 'Mumbai'),
('c2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Priya Patel', 'priya@example.com', '+919800000002', 'Ahmedabad'),
('c3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Amit Singh', 'amit@example.com', '+919800000003', 'Delhi'),
('c4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Neha Gupta', 'neha@example.com', '+919800000004', 'Bangalore'),
('c5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Vikram Reddy', 'vikram@example.com', '+919800000005', 'Hyderabad'),
('c6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'Anjali Desai', 'anjali@example.com', '+919800000006', 'Pune'),
('c7777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'Rohan Kumar', 'rohan@example.com', '+919800000007', 'Chennai'),
('c8888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'Sneha Joshi', 'sneha@example.com', '+919800000008', 'Jaipur');

-- Insert Payment Events
INSERT INTO payment_events (id, merchant_id, customer_id, amount, status, payment_method, failure_reason) VALUES
('p1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 5000.00, 'FAILED', 'UPI', 'Insufficient Funds'),
('p2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', 12000.00, 'FAILED', 'Credit Card', 'Card Expired'),
('p3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', 3500.00, 'ABANDONED', NULL, 'User closed checkout page'),
('p4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'c4444444-4444-4444-4444-444444444444', 8000.00, 'FAILED', 'NetBanking', 'Bank Network Timeout'),
('p5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'c5555555-5555-5555-5555-555555555555', 4500.00, 'FAILED', 'Debit Card', 'Authentication Failed'),
('p6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'c6666666-6666-6666-6666-666666666666', 15000.00, 'FAILED', 'Credit Card', 'Exceeds Credit Limit'),
('p7777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', 'c7777777-7777-7777-7777-777777777777', 2500.00, 'ABANDONED', NULL, 'User inactivity timeout'),
('p8888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'c8888888-8888-8888-8888-888888888888', 6000.00, 'FAILED', 'UPI', 'VPA Invalid');

-- Insert Recovery Cases
INSERT INTO recovery_cases (id, payment_event_id, risk_level, ai_status, recovery_status, confidence_score) VALUES
('r1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'HIGH', 'ANALYZED', 'OPEN', 92.5),
('r2222222-2222-2222-2222-222222222222', 'p2222222-2222-2222-2222-222222222222', 'MEDIUM', 'ANALYZED', 'OPEN', 85.0),
('r3333333-3333-3333-3333-333333333333', 'p3333333-3333-3333-3333-333333333333', 'LOW', 'ACTION_SENT', 'RECOVERED', 98.2),
('r4444444-4444-4444-4444-444444444444', 'p4444444-4444-4444-4444-444444444444', 'MEDIUM', 'ANALYZED', 'OPEN', 75.0),
('r5555555-5555-5555-5555-555555555555', 'p5555555-5555-5555-5555-555555555555', 'HIGH', 'ANALYZED', 'OPEN', 88.5),
('r6666666-6666-6666-6666-666666666666', 'p6666666-6666-6666-6666-666666666666', 'HIGH', 'PENDING', 'FAILED', 60.0),
('r7777777-7777-7777-7777-777777777777', 'p7777777-7777-7777-7777-777777777777', 'LOW', 'ACTION_SENT', 'IN_PROGRESS', 82.0),
('r8888888-8888-8888-8888-888888888888', 'p8888888-8888-8888-8888-888888888888', 'MEDIUM', 'ANALYZED', 'OPEN', 95.0);

-- Insert Audit Logs
INSERT INTO audit_logs (merchant_id, recovery_case_id, event, explanation, actor, metadata) VALUES
('11111111-1111-1111-1111-111111111111', 'r1111111-1111-1111-1111-111111111111', 'AI Analysis Complete', 'Detected insufficient funds. Recommending partial payment schedule.', 'AI', '{"reason": "Insufficient Funds", "suggestion": "Partial Payment"}'),
('11111111-1111-1111-1111-111111111111', 'r2222222-2222-2222-2222-222222222222', 'AI Analysis Complete', 'Card expired. Needs update payment method link.', 'AI', '{"reason": "Card Expired", "suggestion": "Update Link"}'),
('11111111-1111-1111-1111-111111111111', 'r3333333-3333-3333-3333-333333333333', 'Auto-Retry Initiated', 'Bank timeout detected. System retrying.', 'SYSTEM', '{"reason": "Timeout", "action": "Retry"}'),
('11111111-1111-1111-1111-111111111111', 'r3333333-3333-3333-3333-333333333333', 'Payment Recovered', 'Retry successful.', 'SYSTEM', '{"status": "SUCCESS"}'),
('11111111-1111-1111-1111-111111111111', 'r4444444-4444-4444-4444-444444444444', 'AI Analysis Complete', 'Timeout error. Scheduled retry.', 'AI', '{"reason": "Timeout", "suggestion": "Retry in 2hrs"}'),
('11111111-1111-1111-1111-111111111111', 'r5555555-5555-5555-5555-555555555555', 'Manual Action Triggered', 'Merchant requested manual UPI verification.', 'MERCHANT', '{"action": "Manual Verify"}'),
('11111111-1111-1111-1111-111111111111', 'r6666666-6666-6666-6666-666666666666', 'Recovery Failed', 'Customer declined EMI options.', 'SYSTEM', '{"reason": "Declined"}'),
('11111111-1111-1111-1111-111111111111', 'r7777777-7777-7777-7777-777777777777', 'Coupon Sent', '10% discount offered for abandoned cart.', 'SYSTEM', '{"action": "Coupon", "value": "10%"}'),
('11111111-1111-1111-1111-111111111111', 'r8888888-8888-8888-8888-888888888888', 'AI Analysis Complete', 'VPA invalid. Suggesting alternative UPI ID.', 'AI', '{"reason": "Invalid VPA", "suggestion": "Alternate UPI"}'),
('11111111-1111-1111-1111-111111111111', NULL, 'Webhook Processed', 'Received 12 payment failure events today.', 'SYSTEM', '{"count": 12}');
