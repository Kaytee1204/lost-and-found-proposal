-- Enable pgcrypto extension for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================================
-- 1. USERS TABLE
-- ==========================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_phone ON users(phone);

-- ==========================================================
-- 2. ITEMS TABLE (Lost & Found Posts)
-- ==========================================================
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_type VARCHAR(20) NOT NULL, -- LOST, FOUND
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    color VARCHAR(100),
    brand VARCHAR(100),
    size VARCHAR(50),
    material VARCHAR(100),
    location VARCHAR(255),
    event_date DATE NOT NULL,
    event_time TIME,
    image_url VARCHAR(500),
    additional_characteristics TEXT,
    contact_phone VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'LOST', -- LOST, FOUND, RETURNED, CLOSED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_items_user_id ON items(user_id);
CREATE INDEX idx_items_type ON items(item_type);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_event_date ON items(event_date);
CREATE INDEX idx_items_category ON items(category);

-- ==========================================================
-- 3. SEED DEFAULT USERS
-- ==========================================================

-- Admin: phone = 0987654321, password = admin
INSERT INTO users (id, phone, email, password_hash, full_name, role, status)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    '0987654321',
    'admin@sagasu.local',
    '$2a$10$12k.DoYIRluDShKYbeQkxeu9ntViYT.aZZ3lktO5cFRMC4ofM80HK',
    'Administrator',
    'ROLE_ADMIN',
    'ACTIVE'
) ON CONFLICT (phone) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    status = EXCLUDED.status;

-- User: phone = 0912345678, password = user
INSERT INTO users (id, phone, email, password_hash, full_name, role, status)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    '0912345678',
    'user@sagasu.local',
    '$2a$10$ieunXL7Zz738JJccgODIoOhXqHvZId1Gu5UjWDLyl7.1lVBsHjn8.',
    'Default User',
    'ROLE_USER',
    'ACTIVE'
) ON CONFLICT (phone) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    status = EXCLUDED.status;
