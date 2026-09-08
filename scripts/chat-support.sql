-- ============================================
-- Live Chat (hybrid AI + human handoff) migration
-- Run this in the Supabase SQL editor
-- ============================================

-- 1) Chat sessions — one row per visitor session, tracks whether an
--    owner has taken over (AI stops, human replies instead)
CREATE TABLE IF NOT EXISTS chat_sessions (
  session_id TEXT PRIMARY KEY,
  visitor_name TEXT DEFAULT '',
  visitor_email TEXT DEFAULT '',
  page TEXT DEFAULT '',
  ai_active BOOLEAN DEFAULT TRUE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chat_sessions_last_idx ON chat_sessions (last_message_at DESC);

-- 2) Chat messages — user (visitor), assistant (AI), owner (you)
CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES chat_sessions(session_id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'owner')),
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chat_messages_session_idx ON chat_messages (session_id, id);
CREATE INDEX IF NOT EXISTS chat_messages_unread_idx ON chat_messages (read_at) WHERE read_at IS NULL;

-- 3b) Chats become CRM leads — track which session a chat-sourced lead came from
--     so the same conversation never creates a duplicate lead.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS session_id TEXT DEFAULT '';
CREATE INDEX IF NOT EXISTS leads_source_session_idx ON leads (session_id, source);

-- 3c) Column-level protection: anonymous/authenticated keys are denied.
--    Only the service-role key (used by all chat APIs via getSupabaseAdmin) can access.
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- 4) Notifications already stream to the admin panel (chime + badge + toast)
--    via the existing supabase_realtime publication for the notifications table,
--    so no realtime subscription is required here.