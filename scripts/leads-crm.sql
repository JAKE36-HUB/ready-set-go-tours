-- ============================================
-- Lead Management CRM migration
-- Run this in the Supabase SQL editor
-- ============================================

-- 1) Unified leads table (all lead sources land here:
--    contact_form, booking, newsletter, whatsapp, popup_lead, package_inquiry)
CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
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
  page TEXT DEFAULT '',
  utm_source TEXT DEFAULT '',
  utm_medium TEXT DEFAULT '',
  utm_campaign TEXT DEFAULT '',
  browser TEXT DEFAULT '',
  device TEXT DEFAULT '',
  ip TEXT DEFAULT '',
  ip_country TEXT DEFAULT '',
  status TEXT DEFAULT 'new',
  assigned_to TEXT DEFAULT '',
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);
CREATE INDEX IF NOT EXISTS leads_created_idx ON leads (created_at);
CREATE INDEX IF NOT EXISTS leads_archived_idx ON leads (archived);
CREATE INDEX IF NOT EXISTS leads_source_idx ON leads (source);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leads_updated_at_trigger ON leads;
CREATE TRIGGER leads_updated_at_trigger
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION set_leads_updated_at();

-- 2) Lead timeline events (created, status changes, notes, reminders)
CREATE TABLE IF NOT EXISTS lead_events (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  detail TEXT DEFAULT '',
  created_by TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lead_events_lead_idx ON lead_events (lead_id);
CREATE INDEX IF NOT EXISTS lead_events_created_idx ON lead_events (created_at);

-- 3) Follow-up reminders
CREATE TABLE IF NOT EXISTS reminders (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  title TEXT DEFAULT '',
  due_at TIMESTAMPTZ NOT NULL,
  done BOOLEAN DEFAULT FALSE,
  created_by TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS reminders_due_idx ON reminders (due_at);
CREATE INDEX IF NOT EXISTS reminders_lead_idx ON reminders (lead_id);
CREATE INDEX IF NOT EXISTS reminders_done_idx ON reminders (done);

-- 4) Notification center
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT DEFAULT '',
  body TEXT DEFAULT '',
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS notifications_read_idx ON notifications (read, archived);
CREATE INDEX IF NOT EXISTS notifications_created_idx ON notifications (created_at);

-- 5) Row Level Security: enabled with NO policies.
--    anon/authenticated keys are denied; only the service-role key
--    (used by all admin APIs via getSupabaseAdmin + requireUser) can access.
--    This matches the popup_leads/popup_events pattern.
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 6) Realtime: stream new rows to the server-side bridge
--    (the admin browser receives them over SSE from /api/admin/realtime/stream).
--    Service role bypasses RLS, so client-side anon subscriptions see nothing.
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE leads;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
