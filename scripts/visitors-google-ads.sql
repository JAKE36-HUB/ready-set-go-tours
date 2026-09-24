-- Run this SQL in your Supabase project's SQL Editor
-- Adds Google Ads click attribution to the visitors table so the
-- admin Visitors page can flag traffic that came from Google Ads.

ALTER TABLE visitors ADD COLUMN IF NOT EXISTS is_google_ads BOOLEAN DEFAULT FALSE;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS gclid TEXT DEFAULT '';