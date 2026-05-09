-- ============================================
-- PLACIDA — Supabase PostgreSQL Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================

-- MOODS TABLE
CREATE TABLE public.moods (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid REFERENCES auth.users NOT NULL,
  score      int  NOT NULL CHECK (score BETWEEN 1 AND 5),
  label      text,
  emoji      text,
  note       text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own moods" ON public.moods
  FOR ALL USING (auth.uid() = user_id);

-- JOURNALS TABLE
CREATE TABLE public.journals (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users NOT NULL,
  prompt_text text,
  content     text NOT NULL,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own journals" ON public.journals
  FOR ALL USING (auth.uid() = user_id);

-- BREATHE SESSIONS TABLE
CREATE TABLE public.breathe_sessions (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid REFERENCES auth.users NOT NULL,
  pattern    text DEFAULT '478',
  cycles     int  DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.breathe_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own breathe sessions" ON public.breathe_sessions
  FOR ALL USING (auth.uid() = user_id);

-- CHAT MESSAGES TABLE
CREATE TABLE public.chat_messages (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid REFERENCES auth.users NOT NULL,
  role       text NOT NULL CHECK (role IN ('user','bot')),
  content    text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own chat messages" ON public.chat_messages
  FOR ALL USING (auth.uid() = user_id);
