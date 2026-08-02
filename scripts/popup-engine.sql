-- ============================================
-- Popup Marketing Engine migration
-- Run this in the Supabase SQL editor
-- ============================================

-- 1) Extend popups table with marketing engine columns
ALTER TABLE popups
  ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'modal',
  ADD COLUMN IF NOT EXISTS priority INT DEFAULT 5,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS template TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS variant_of INT REFERENCES popups(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS traffic_split INT DEFAULT 50;

CREATE INDEX IF NOT EXISTS popups_status_idx ON popups (status);
CREATE INDEX IF NOT EXISTS popups_variant_of_idx ON popups (variant_of);

-- 2) Popup event tracking (impressions, clicks, dismissals, conversions, whatsapp clicks)
CREATE TABLE IF NOT EXISTS popup_events (
  id BIGSERIAL PRIMARY KEY,
  popup_id INT NOT NULL REFERENCES popups(id) ON DELETE CASCADE,
  variant TEXT DEFAULT 'A',
  event_type TEXT NOT NULL,
  cta_index INT,
  cta_label TEXT DEFAULT '',
  page TEXT DEFAULT '',
  session_id TEXT DEFAULT '',
  device TEXT DEFAULT '',
  country TEXT DEFAULT '',
  source TEXT DEFAULT '',
  utm_campaign TEXT DEFAULT '',
  duration_ms INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS popup_events_popup_idx ON popup_events (popup_id);
CREATE INDEX IF NOT EXISTS popup_events_type_idx ON popup_events (event_type);
CREATE INDEX IF NOT EXISTS popup_events_created_idx ON popup_events (created_at);

-- RLS enabled with NO policies = anon/authenticated denied, service role bypasses
ALTER TABLE popup_events ENABLE ROW LEVEL SECURITY;

-- 3) Popup lead capture (form submissions)
CREATE TABLE IF NOT EXISTS popup_leads (
  id BIGSERIAL PRIMARY KEY,
  popup_id INT REFERENCES popups(id) ON DELETE SET NULL,
  popup_name TEXT DEFAULT '',
  variant TEXT DEFAULT 'A',
  name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  country TEXT DEFAULT '',
  destination TEXT DEFAULT '',
  travel_date TEXT DEFAULT '',
  budget TEXT DEFAULT '',
  adults TEXT DEFAULT '',
  children TEXT DEFAULT '',
  message TEXT DEFAULT '',
  source TEXT DEFAULT '',
  utm_campaign TEXT DEFAULT '',
  page TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS popup_leads_popup_idx ON popup_leads (popup_id);
CREATE INDEX IF NOT EXISTS popup_leads_created_idx ON popup_leads (created_at);

ALTER TABLE popup_leads ENABLE ROW LEVEL SECURITY;
