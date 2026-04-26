// frontend/supabase.js
const SUPABASE_URL = 'https://snmfdktkjggsszziexsz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ZspyU3qfMZwqYIfVtrA1-g_K9Vz_c9c';

// Load Supabase SDK from CDN
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
script.onload = () => {
  window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.supabase = window.supabaseClient; // Alias for convenience
  document.dispatchEvent(new Event('supabase:ready'));
};
document.head.appendChild(script);

window.requireAuth = async function() {
  if (!window.supabase) {
    // Wait for it to be ready
    document.addEventListener('supabase:ready', window.requireAuth);
    return;
  }
  const { data: { user } } = await window.supabase.auth.getUser();
  if (!user) {
    window.location.href = 'auth.html';
  }
};

window.withSupabase = function(cb) {
  if (window.supabase) {
    cb(window.supabase);
  } else {
    document.addEventListener('supabase:ready', () => cb(window.supabase));
  }
};

window.getUser = async function() {
  if (!window.supabase) return null;
  const { data: { user } } = await window.supabase.auth.getUser();
  return user;
};

window.signOut = async function() {
  if (window.supabase) {
    await window.supabase.auth.signOut();
    window.location.href = 'auth.html';
  }
};
