-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: roles
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    api_token VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: user_roles
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Table: travel_expenses
CREATE TABLE IF NOT EXISTS travel_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    destination VARCHAR(255) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Submitted', 'Approved', 'Rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_travel_expenses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_travel_expenses_user_id ON travel_expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_expenses_status ON travel_expenses(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Seed Data: System Roles (RBAC)
INSERT INTO roles (name, description) VALUES
    ('admin', 'System Administrator with full access'),
    ('requester', 'Standard user who requests travel expenses'),
    ('approver', 'User who approves or rejects travel expense requests')
ON CONFLICT (name) DO NOTHING;

-- Seed Data: Default Users
-- Default password for all seed users: AdminPassword123! (hashed with Argon2id)
INSERT INTO users (id, username, email, password_hash) VALUES
    (
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        'admin',
        'admin@institution.gob.ec',
        '$argon2id$v=19$m=65536,t=3,p=4$yiLiigHhg/kkWORvWHB2eg$BXbIaAZ5yLzWxAB2u0aX7mmeeYTqWC735fxMVFMgP7Y'
    ),
    (
        'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
        'requester',
        'requester@institution.gob.ec',
        '$argon2id$v=19$m=65536,t=3,p=4$yiLiigHhg/kkWORvWHB2eg$BXbIaAZ5yLzWxAB2u0aX7mmeeYTqWC735fxMVFMgP7Y'
    ),
    (
        'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
        'approver',
        'approver@institution.gob.ec',
        '$argon2id$v=19$m=65536,t=3,p=4$yiLiigHhg/kkWORvWHB2eg$BXbIaAZ5yLzWxAB2u0aX7mmeeYTqWC735fxMVFMgP7Y'
    )
ON CONFLICT (email) DO NOTHING;

-- Assign roles to seed users
INSERT INTO user_roles (user_id, role_id)
SELECT 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', id FROM roles WHERE name = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', id FROM roles WHERE name = 'requester'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', id FROM roles WHERE name = 'approver'
ON CONFLICT DO NOTHING;
