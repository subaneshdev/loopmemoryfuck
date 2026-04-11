-- LoopMemory Waitlist Schema
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  use_case TEXT,
  plan_interest TEXT DEFAULT 'pro',
  source TEXT DEFAULT 'pricing_page',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow insert for waitlist" ON waitlist FOR ALL USING (true);
