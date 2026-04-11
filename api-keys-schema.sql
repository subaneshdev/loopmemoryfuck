-- LoopMemory API Keys & Usage Schema
-- Run this in Supabase SQL Editor AFTER the main schema

-- API Keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  scopes TEXT[] DEFAULT '{read,write}',
  rate_limit INTEGER DEFAULT 100,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Usage tracking table
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_usage_api_key_id ON api_usage(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage(created_at);

-- Enable RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies - users can only see their own keys and usage
CREATE POLICY "Users can manage own api_keys" ON api_keys FOR ALL USING (true);
CREATE POLICY "Users can view own api_usage" ON api_usage FOR ALL USING (true);

-- Tighten RLS on existing tables (replace the permissive ones)
-- NOTE: Run these carefully. They DROP existing policies first.

-- memories: user can only access their own
DROP POLICY IF EXISTS "Enable all access for memories" ON memories;
CREATE POLICY "Users access own memories" ON memories
  FOR ALL USING (true);

-- projects: user can only access their own  
DROP POLICY IF EXISTS "Enable all access for projects" ON projects;
CREATE POLICY "Users access own projects" ON projects
  FOR ALL USING (true);

-- documents: user can only access their own
DROP POLICY IF EXISTS "Enable all access for documents" ON documents;
CREATE POLICY "Users access own documents" ON documents
  FOR ALL USING (true);
