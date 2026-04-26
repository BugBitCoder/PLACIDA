# 🗄️ Supabase Setup Guide — Placida

## Step 1 — Create Account & Project
1. Go to https://supabase.com and sign up (free)
2. Click "New Project" → name it placida
3. Choose any region (Mumbai for India)
4. Set a strong DB password → click "Create"
5. Wait ~2 minutes for the project to provision

## Step 2 — Run the Schema
1. In Supabase dashboard, click *SQL Editor* (left sidebar)
2. Click *"New Query"*
3. Copy the entire contents of database/schema.sql
4. Paste into the editor → click *"Run"*
5. You should see: "Success. No rows returned"

## Step 3 — Enable Email Authentication
1. Go to *Authentication → Providers*
2. Make sure *Email* is enabled (it is by default)
3. Optional: enable *Google* OAuth for social login

## Step 4 — Get Your API Keys
1. Go to *Project Settings → API*
2. Copy the *Project URL* (looks like: https://abcdef.supabase.co)
3. Copy the *anon / public key* (long string starting with eyJ...)

## Step 5 — Add Keys to the Project
Open frontend/supabase.js and replace:
```js
const SUPABASE_URL  = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON = 'YOUR_ANON_KEY_HERE';
```
