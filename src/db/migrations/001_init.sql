-- Explicitly set schema
SET search_path TO public;

-- Safe extension creation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

-- Users table with explicit grants
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT public.uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL CHECK (length(password_hash) > 60),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Grant permissions explicitly
ALTER TABLE users OWNER TO admonitor;
GRANT ALL PRIVILEGES ON TABLE users TO admonitor;
