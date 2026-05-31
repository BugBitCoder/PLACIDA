# NEXT ACTIONS — Placida

## Immediate (Optional Polish)
- [x] BUG-004: statAvg card — dynamically color based on avg value (green ≥4, yellow ≥3, red <3)
- [x] Test admin.html with real multi-user feedback data
- [x] Add Supabase SQL migration for `feedback_responses` table (see IMPLEMENTATION_LOG for schema)

## Optional Future Enhancements
- [ ] Add date range filter to admin table (date picker)
- [ ] Add CSV export option (simpler than XLSX for non-Excel users)
- [ ] Add print/PDF report button
- [ ] Add email digest of feedback (weekly summary email via Supabase edge function)
- [ ] Add "Trending Improvement Requests" word cloud
- [ ] Consider moving feedback data from localStorage to Supabase for cross-device sync

## Supabase Table Migration Required
To enable Supabase persistence for feedback, run this SQL in Supabase Studio:
```sql
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
-- Enable RLS
ALTER TABLE feedback_responses ENABLE ROW LEVEL SECURITY;
-- Allow authenticated users to insert their own feedback
CREATE POLICY "Users can insert own feedback" ON feedback_responses FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
-- Allow admins to read all (add admin check as needed)
CREATE POLICY "Service role reads all" ON feedback_responses FOR SELECT USING (true);
```

## Verification Checklist
- [x] SOS scrolls independently on mobile (no page freeze)
- [x] Dashboard shows logged-in user's real name
- [x] Feedback thank-you card shows correct name
- [x] XSS: mood note with <script> tag is safely escaped
- [x] Old entries don't show "NaN ago"
- [x] admin.html charts render correctly
- [x] Excel export downloads with 6 sheets
- [x] Admin search, filter, pagination work
- [x] GitHub Pages deployment live
