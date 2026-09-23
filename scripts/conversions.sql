-- Run this SQL in your Supabase project's SQL Editor
-- Creates the conversions table used to log conversion events
-- (WhatsApp clicks, live chat, contact form, booking enquiries,
--  itinerary quotes, and popup leads) alongside Google Ads tracking.

CREATE TABLE IF NOT EXISTS conversions (
  id SERIAL PRIMARY KEY,
  session_id TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'lead',
  label TEXT DEFAULT '',
  details TEXT DEFAULT '',
  page TEXT DEFAULT '',
  ip TEXT DEFAULT '',
  country TEXT DEFAULT '',
  city TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversions_created_at ON conversions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversions_session ON conversions (session_id);
CREATE INDEX IF NOT EXISTS idx_conversions_type ON conversions (type);