-- Run this script in the Supabase Studio SQL Editor to create the feedback table

CREATE TABLE feedback_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT,
  user_email TEXT,
  academic_year TEXT,
  stress_frequency TEXT,
  rating_moodlogger INT,
  rating_dashboard INT,
  rating_breathing INT,
  rating_chat INT,
  rating_journal INT,
  nps_score INT,
  breathing_preference TEXT,
  session_duration TEXT,
  most_used_features TEXT[],
  requested_improvements TEXT,
  preferred_time TEXT,
  preferred_platform TEXT,
  sos_preference TEXT,
  liked_most TEXT,
  improve TEXT,
  open_comment TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE feedback_responses ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own feedback (or anonymous users if user_id is null)
CREATE POLICY "Users can insert own feedback" 
ON feedback_responses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Allow service role / admin to read all feedback
CREATE POLICY "Service role reads all" 
ON feedback_responses 
FOR SELECT 
USING (true);
