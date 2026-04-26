/* ============================================
   PLACIDA — supabase.js  (Sanchari's branch)
   ============================================ */

const SUPABASE_URL  = 'https://snmfdktkjggsszziexsz.supabase.co';
const SUPABASE_ANON = 'sb_publishable_ZspyU3qfMZwqYIfVtrA1-g_K9Vz_c9c';

(function loadSupabase() {
  if (window.supabase) return;
  if (SUPABASE_URL.includes('YOUR_PROJECT_ID') || SUPABASE_ANON.includes('YOUR_ANON_KEY')) {
    window.supabase = null;
    document.dispatchEvent(new Event('supabase:ready'));
    return;
  }
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
  script.onload = () => {
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
    document.dispatchEvent(new Event('supabase:ready'));
  };
  script.onerror = () => {
    console.warn('[Placida] Supabase SDK failed to load');
    document.dispatchEvent(new Event('supabase:ready'));
  };
  document.head.appendChild(script);
})();

function withSupabase(cb) {
  if (window.supabase?.from) { cb(window.supabase); return; }
  document.addEventListener('supabase:ready', () => cb(window.supabase), { once: true });
}
async function getUser() { return window.supabase?.auth.getUser(); }
async function signOut() { await window.supabase?.auth.signOut(); window.location.href = 'auth.html'; }
function requireAuth() {
  withSupabase(async (sb) => {
    if (!sb) return;
    const { data: { session } } = await sb.auth.getSession();
    if (!session) window.location.href = 'auth.html';
  });
}
