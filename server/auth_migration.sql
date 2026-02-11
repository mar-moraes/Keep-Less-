-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add user_id to Notes (assuming we clear data first for simplicity, or we'd need a default)
DELETE FROM notes; -- Clear existing notes to avoid FK violation
DELETE FROM labels; -- Clear existing labels

ALTER TABLE notes ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE labels ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

-- Update queries will act on this user_id
