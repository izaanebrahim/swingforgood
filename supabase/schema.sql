-- ============================================================
-- SwingForGood Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  subscription_status TEXT NOT NULL DEFAULT 'none' CHECK (subscription_status IN ('active', 'past_due', 'canceled', 'none')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  charity_id UUID,
  contribution_percentage INTEGER NOT NULL DEFAULT 10 CHECK (contribution_percentage >= 10 AND contribution_percentage <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CHARITIES TABLE
-- ============================================================
CREATE TABLE public.charities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  logo_url TEXT,
  website_url TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  featured BOOLEAN NOT NULL DEFAULT false,
  total_contributions NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key for users.charity_id
ALTER TABLE public.users
  ADD CONSTRAINT fk_users_charity
  FOREIGN KEY (charity_id) REFERENCES public.charities(id) ON DELETE SET NULL;

-- ============================================================
-- SCORES TABLE
-- ============================================================
CREATE TABLE public.scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 45),
  date_played DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scores_user_date ON public.scores(user_id, date_played DESC);

-- ============================================================
-- DRAWS TABLE
-- ============================================================
CREATE TABLE public.draws (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'drawn', 'published')),
  total_prize_pool NUMERIC(12,2) NOT NULL DEFAULT 0,
  jackpot_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  match_4_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  match_3_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  winning_numbers INTEGER[] NOT NULL DEFAULT '{}',
  rollover_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(month, year)
);

-- ============================================================
-- WINNERS TABLE
-- ============================================================
CREATE TABLE public.winners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  match_type INTEGER NOT NULL CHECK (match_type IN (3, 4, 5)),
  matched_numbers INTEGER[] NOT NULL DEFAULT '{}',
  prize_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  proof_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_winners_draw ON public.winners(draw_id);
CREATE INDEX idx_winners_user ON public.winners(user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

CREATE POLICY "Admins can update all users"
  ON public.users FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- Charities (public read, admin write)
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view charities"
  ON public.charities FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage charities"
  ON public.charities FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- Scores
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scores"
  ON public.scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scores"
  ON public.scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scores"
  ON public.scores FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all scores"
  ON public.scores FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- Draws (public read, admin write)
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published draws"
  ON public.draws FOR SELECT
  USING (status = 'published' OR EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin'
  ));

CREATE POLICY "Admins can manage draws"
  ON public.draws FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- Winners
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own winnings"
  ON public.winners FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own winner proof"
  ON public.winners FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage winners"
  ON public.winners FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- ============================================================
-- FUNCTION: Auto-create user profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- FUNCTION: Auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- SEED DATA: Sample Charities
-- ============================================================
INSERT INTO public.charities (name, description, category, featured, logo_url, website_url) VALUES
  ('On Course Foundation', 'Using golf to support the recovery of wounded, injured and sick military veterans and those with disabilities.', 'Veterans & Health', true, NULL, 'https://oncoursefoundation.com'),
  ('Golf Foundation', 'Inspiring young people through golf, promoting health, wellbeing, and personal development for all.', 'Youth & Education', true, NULL, 'https://golf-foundation.org'),
  ('GreenStar Trust', 'Protecting biodiversity on golf courses and promoting sustainable environmental practices.', 'Environment', true, NULL, 'https://greenstar.org'),
  ('The R&A Junior Golf', 'Developing grassroots golf programs for underprivileged children around the world.', 'Youth & Education', false, NULL, 'https://randa.org'),
  ('Sunshine Tour Charity', 'Supporting communities in Southern Africa through charitable golf initiatives.', 'Community', false, NULL, 'https://sunshinetour.com'),
  ('First Tee', 'Building game changers by empowering young people through golf and character education.', 'Youth & Education', false, NULL, 'https://firsttee.org');
