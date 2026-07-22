-- Run this SQL in your Supabase project's SQL Editor
-- This creates all the tables needed for the admin CMS

CREATE TABLE IF NOT EXISTS tour_packages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'safari',
  image TEXT DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  price_kes NUMERIC,
  duration TEXT NOT NULL DEFAULT '',
  accommodation TEXT DEFAULT '',
  meals TEXT DEFAULT '',
  transport TEXT DEFAULT '',
  activities TEXT[] DEFAULT '{}',
  description TEXT DEFAULT '',
  highlights TEXT[] DEFAULT '{}',
  included TEXT[] DEFAULT '{}',
  excluded TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deals (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  discount TEXT DEFAULT '',
  code TEXT DEFAULT '',
  image TEXT DEFAULT '',
  type TEXT NOT NULL DEFAULT 'special',
  original_price NUMERIC NOT NULL DEFAULT 0,
  deal_price NUMERIC NOT NULL DEFAULT 0,
  price_kes NUMERIC,
  valid_until TEXT DEFAULT '',
  highlights TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  duration TEXT DEFAULT '',
  accommodation TEXT DEFAULT '',
  meals TEXT DEFAULT '',
  included TEXT[] DEFAULT '{}',
  itinerary JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS honeymoon_packages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  price_kes NUMERIC,
  duration TEXT NOT NULL DEFAULT '',
  accommodation TEXT DEFAULT '',
  meals TEXT DEFAULT '',
  transport TEXT DEFAULT '',
  activities TEXT[] DEFAULT '{}',
  description TEXT DEFAULT '',
  highlights TEXT[] DEFAULT '{}',
  included TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS destinations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT DEFAULT '',
  description TEXT DEFAULT '',
  rating NUMERIC DEFAULT 0,
  best_time TEXT DEFAULT '',
  duration TEXT DEFAULT '',
  starting_price NUMERIC DEFAULT 0,
  highlights TEXT[] DEFAULT '{}',
  region TEXT DEFAULT 'kenya',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  src TEXT NOT NULL,
  alt TEXT DEFAULT '',
  category TEXT DEFAULT 'uncategorized',
  width INT DEFAULT 800,
  height INT DEFAULT 600,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT[] DEFAULT '{}',
  image TEXT DEFAULT '',
  author TEXT DEFAULT '',
  date TEXT DEFAULT '',
  category TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional - admin API uses service role)
ALTER TABLE tour_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE honeymoon_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
