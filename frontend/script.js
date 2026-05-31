/* ============================================
   PLACIDA — script.js
   Week 1-4+ Full Feature Logic
   ============================================ */

const MOODS = [
  { id: 'terrible', emoji: '😔', label: 'Rough',   score: 1 },
  { id: 'bad',      emoji: '😟', label: 'Low',     score: 2 },
  { id: 'okay',     emoji: '😐', label: 'Okay',    score: 3 },
  { id: 'good',     emoji: '🙂', label: 'Good',    score: 4 },
  { id: 'great',    emoji: '😊', label: 'Great',   score: 5 },
];

const STORAGE_KEY = 'placida_moods';
let selectedMood  = null;
let moodChartInstance = null;

/* ── Shared Utilities ── */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

function getMoods() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function escapeHtml(text) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(text));
  return d.innerHTML;
}

function formatTime(isoString) {
  const date = new Date(isoString);
  const diff = Math.max(0, (Date.now() - date) / 1000); // BUG-006: guard negative diff
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/* ── Mood Logger ── */
function selectMood(moodId) {
  selectedMood = MOODS.find(m => m.id === moodId);
  document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.mood === moodId);
  });
}

function saveMood() {
  if (!selectedMood) { showToast('💜 Please pick a mood first!'); return; }
  const noteInput = document.getElementById('moodNote');
  const note      = noteInput ? noteInput.value.trim() : '';
  const entry = {
    id: Date.now(), emoji: selectedMood.emoji, label: selectedMood.label,
    score: selectedMood.score, note: note || '', timestamp: new Date().toISOString(),
  };
  const existing = getMoods();
  existing.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

  withSupabase && withSupabase(async (sb) => {
    if (!sb) return;
    const { data: { user } } = await sb.auth.getUser().catch(() => ({ data: {} }));
    if (!user) return;
    await sb.from('moods').insert({ user_id: user.id, score: entry.score, label: entry.label,
      emoji: entry.emoji, note: entry.note, created_at: entry.timestamp }).catch(() => {});
  });

  selectedMood = null;
  document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
  if (noteInput) noteInput.value = '';
  showToast('✨ Mood saved! Keep going.');
  renderWellnessRecommendations();
  renderStreakMilestone();
}

/* ── Dashboard Stats & History ── */
function computeWeeklySummary(moods) {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = moods.filter(m => new Date(m.timestamp).getTime() > cutoff);
  if (!recent.length) return { count: 0, avg: null, trend: '—' };
  const avg = recent.reduce((s, m) => s + m.score, 0) / recent.length;
  return { count: recent.length, avg: avg.toFixed(1), trend: avg >= 4 ? '📈 Positive' : avg >= 3 ? '➡️ Stable' : '📉 Needs care' };
}

function renderStats() {
  const moods = getMoods();
  const summary = computeWeeklySummary(moods);
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('statTotal', moods.length);
  set('statWeek',  summary.count);
  set('statAvg',   summary.avg ?? '—');
  set('statTrend', summary.trend);
}

function renderMoodHistory() {
  const container = document.getElementById('moodHistory');
  if (!container) return;
  const moods = getMoods();
  if (!moods.length) {
    container.innerHTML = `<div class="empty-state"><div class="empty-emoji">💭</div><p>No moods logged yet.<br>Head to the home page to log your first one!</p></div>`;
    return;
  }
  container.innerHTML = moods.slice(0, 10).map(e => `
    <div class="mood-entry">
      <div class="entry-emoji">${e.emoji}</div>
      <div class="entry-info">
        <div class="entry-mood">${e.label}</div>
        ${e.note ? `<div class="entry-note">${escapeHtml(e.note)}</div>` : ''}
      </div>
      <div class="entry-time">${formatTime(e.timestamp)}</div>
    </div>`).join('');
}

/* ── Greeting + Streak ── */
function getGreetingPrefix() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'Good morning';
  if (h >= 12 && h < 17) return 'Good afternoon';
  if (h >= 17 && h < 21) return 'Good evening';
  return 'Good night';
}

function computeStreak(moods) {
  if (!moods.length) return 0;
  const days = [...new Set(moods.map(m => new Date(m.timestamp).toDateString()))];
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (days.includes(d.toDateString())) streak++;
    else break;
  }
  return streak;
}

function renderGreeting(userName) {
  const name = userName || localStorage.getItem('placida_user_name') || 'Friend';
  const greetEl = document.getElementById('dashGreeting');
  if (greetEl) greetEl.innerHTML = `${getGreetingPrefix()}, <span>${name}</span> 👋`;
  const streak = computeStreak(getMoods());
  const subEl = document.getElementById('dashGreetingSub');
  if (subEl) {
    subEl.innerHTML = streak > 0
      ? `Here's your emotional wellness snapshot. &nbsp;<span class="streak-badge">🔥 ${streak}-day streak</span>`
      : `Here's your emotional wellness snapshot. Log a mood to start your streak!`;
  }
}

function renderGreetingWithAuth() {
  // Always render immediately with cached name to avoid blank flash
  renderGreeting();
  const doRender = (user) => {
    if (user) {
      const meta = user.user_metadata || {};
      // Priority: full_name > name > display_name > email prefix
      const name = meta.full_name || meta.name || meta.display_name || user.email?.split('@')[0] || null;
      if (name) {
        localStorage.setItem('placida_user_name', name); // refresh cache
        renderGreeting(name.split(' ')[0]);              // use first name only
        return;
      }
    }
    renderGreeting(); // fallback to cached or 'Friend'
  };
  if (window.supabase) {
    window.supabase.auth.getUser().then(({ data }) => doRender(data?.user)).catch(() => renderGreeting());
  } else {
    document.addEventListener('supabase:ready', () => {
      window.supabase?.auth.getUser().then(({ data }) => doRender(data?.user)).catch(() => renderGreeting());
    }, { once: true });
  }
}

/* ── 7-Day Chart ── */
function getLast7DaysData() {
  const moods = getMoods();
  const labels = [], data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString('en-IN', { weekday: 'short' }));
    const dayMoods = moods.filter(m => new Date(m.timestamp).toDateString() === d.toDateString());
    data.push(dayMoods.length ? parseFloat((dayMoods.reduce((s, m) => s + m.score, 0) / dayMoods.length).toFixed(1)) : null);
  }
  return { labels, data };
}

function renderMoodChart() {
  const canvas = document.getElementById('moodChart');
  const emptyMsg = document.getElementById('chartEmptyMsg');
  if (!canvas) return;
  const { labels, data } = getLast7DaysData();
  const hasData = data.some(d => d !== null);
  if (!hasData) { canvas.style.display = 'none'; if (emptyMsg) emptyMsg.style.display = 'flex'; return; }
  canvas.style.display = 'block';
  if (emptyMsg) emptyMsg.style.display = 'none';
  if (moodChartInstance) { moodChartInstance.destroy(); moodChartInstance = null; }
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 240);
  gradient.addColorStop(0, 'rgba(124,106,247,0.9)');
  gradient.addColorStop(1, 'rgba(94,196,182,0.4)');
  moodChartInstance = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Avg Mood', data, backgroundColor: gradient, borderRadius: 10, borderSkipped: false }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(13,15,26,0.95)', borderColor: 'rgba(124,106,247,0.4)', borderWidth: 1, titleColor: '#f0f0ff', bodyColor: '#8888aa', padding: 12,
        callbacks: { label: ctx => { const v = ctx.raw; if (v === null) return '  No entry'; const em = v >= 4.5 ? '😊' : v >= 3.5 ? '🙂' : v >= 2.5 ? '😐' : v >= 1.5 ? '😟' : '😔'; return `  ${em}  Score: ${v} / 5`; } } } },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#8888aa', font: { family: 'Inter', size: 12 } }, border: { color: 'rgba(255,255,255,0.08)' } },
        y: { min: 0, max: 5, grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: '#8888aa', stepSize: 1, font: { family: 'Inter', size: 12 }, callback: v => ['', '😔', '😟', '😐', '🙂', '😊'][v] || '' }, border: { color: 'rgba(255,255,255,0.08)' } }
      }
    }
  });
}

/* ── Clear All Data ── */
function clearAllData() { const m = document.getElementById('confirmModal'); if (m) m.classList.add('show'); }
function confirmClear() {
  localStorage.removeItem(STORAGE_KEY); localStorage.removeItem('placida_chat');
  const m = document.getElementById('confirmModal'); if (m) m.classList.remove('show');
  renderGreeting(); renderMoodHistory(); renderStats(); renderMoodChart();
  renderWellnessRecommendations(); renderStreakMilestone();
  showToast('🗑️ All data cleared.');
}
function cancelClear() { const m = document.getElementById('confirmModal'); if (m) m.classList.remove('show'); }

/* ── Keyboard Shortcuts ── */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const map = { m: 'index.html', b: 'breathe.html', c: 'chatbot.html', d: 'dashboard.html',
      i: 'insights.html', s: 'summary.html', j: 'journal.html', n: 'meditation.html', u: 'community.html' };
    if (map[e.key.toLowerCase()]) window.location.href = map[e.key.toLowerCase()];
  });
  const hint = document.getElementById('shortcutHint');
  const panel = document.getElementById('shortcutPanel');
  if (hint && panel) {
    hint.addEventListener('click', () => { const v = panel.style.display === 'block'; panel.style.display = v ? 'none' : 'block'; panel.setAttribute('aria-hidden', String(v)); });
    document.addEventListener('click', e => { if (!hint.contains(e.target) && !panel.contains(e.target)) { panel.style.display = 'none'; panel.setAttribute('aria-hidden', 'true'); } });
  }
}

/* ── Onboarding ── */
function checkOnboarding() {
  if (localStorage.getItem('placida_onboarded')) { document.body.style.overflow = ''; document.documentElement.style.overflow = ''; return; }
  const modal = document.getElementById('onboardModal');
  if (modal) setTimeout(() => { modal.classList.add('show'); document.body.style.overflow = 'hidden'; }, 700);
}
function dismissOnboarding() {
  localStorage.setItem('placida_onboarded', '1');
  const modal = document.getElementById('onboardModal');
  if (modal) modal.classList.remove('show');
  document.body.style.overflow = ''; document.documentElement.style.overflow = '';
}

/* ── Insights Data ── */
function getLast30DaysData() {
  const moods = getMoods();
  const result = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const dayMoods = moods.filter(m => new Date(m.timestamp).toDateString() === d.toDateString());
    result.push({ date: new Date(d), day: d.getDate(), avg: dayMoods.length ? dayMoods.reduce((s, m) => s + m.score, 0) / dayMoods.length : null, count: dayMoods.length });
  }
  return result;
}

function heatColor(avg) {
  if (avg === null) return 'rgba(255,255,255,0.05)';
  if (avg >= 4.5) return 'rgba(94,196,182,0.90)';
  if (avg >= 3.5) return 'rgba(94,196,182,0.55)';
  if (avg >= 2.5) return 'rgba(124,106,247,0.55)';
  if (avg >= 1.5) return 'rgba(240,107,139,0.45)';
  return 'rgba(240,107,139,0.82)';
}

function renderHeatmap() {
  const container = document.getElementById('moodHeatmap');
  if (!container) return;
  const days = getLast30DaysData();
  const em = [null, '😔', '😟', '😐', '🙂', '😊'];
  container.innerHTML = days.map(d => {
    const tip = d.avg !== null ? `${d.date.toLocaleDateString('en-IN', { day:'numeric', month:'short' })} — ${em[Math.round(d.avg)]} ${d.avg.toFixed(1)}/5` : `${d.date.toLocaleDateString('en-IN', { day:'numeric', month:'short' })} — No entry`;
    return `<div class="heat-cell" style="background:${heatColor(d.avg)};" title="${tip}" role="img" aria-label="${tip}"><span class="heat-date">${d.day}</span>${d.avg !== null ? `<span class="heat-score">${em[Math.round(d.avg)]}</span>` : ''}</div>`;
  }).join('');
}

function renderWeekdayAnalysis() {
  const moods = getMoods();
  const wNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const buckets = wNames.map(w => ({ w, scores: [] }));
  moods.forEach(m => buckets[new Date(m.timestamp).getDay()].scores.push(m.score));
  const data = buckets.map(b => ({ w: b.w, avg: b.scores.length ? b.scores.reduce((s, v) => s + v, 0) / b.scores.length : null }));
  const barsEl = document.getElementById('weekdayBars');
  if (barsEl) {
    barsEl.innerHTML = data.map(d => `
      <div class="wday-col">
        <div class="wday-bar-wrap"><div class="wday-bar" style="height:${d.avg ? (d.avg / 5 * 100) : 2}%;background:${d.avg ? 'linear-gradient(180deg,rgba(124,106,247,0.9),rgba(94,196,182,0.7))' : 'rgba(255,255,255,0.04)'};" title="${d.avg ? d.avg.toFixed(1) + '/5' : 'No data'}"></div></div>
        <div class="wday-label">${d.w}</div>
        <div class="wday-avg">${d.avg ? d.avg.toFixed(1) : '—'}</div>
      </div>`).join('');
  }
  const best = data.filter(d => d.avg !== null).sort((a, b) => b.avg - a.avg)[0];
  const el = document.getElementById('bestWeekday');
  if (el) el.textContent = best ? best.w : '—';
}

function renderTimeBuckets() {
  const moods = getMoods();
  const buckets = [
    { label: 'Morning', icon: '🌅', h0: 5, h1: 12, scores: [] },
    { label: 'Afternoon', icon: '☀️', h0: 12, h1: 17, scores: [] },
    { label: 'Evening', icon: '🌆', h0: 17, h1: 21, scores: [] },
    { label: 'Night', icon: '🌙', h0: 21, h1: 29, scores: [] },
  ];
  moods.forEach(m => { const h = new Date(m.timestamp).getHours(); buckets.forEach(b => { if (h >= b.h0 && h < b.h1) b.scores.push(m.score); }); });
  const avgs = buckets.map(b => ({ ...b, avg: b.scores.length ? b.scores.reduce((s, v) => s + v, 0) / b.scores.length : null }));
  const maxAvg = Math.max(...avgs.filter(b => b.avg !== null).map(b => b.avg), 0);
  const el = document.getElementById('timeGrid');
  if (el) {
    el.innerHTML = avgs.map(b => `
      <div class="time-cell ${b.avg !== null && b.avg === maxAvg ? 'best' : ''}" aria-label="${b.label}: ${b.avg ? b.avg.toFixed(1) + '/5' : 'No data'}">
        <div class="tc-icon">${b.icon}</div>
        <div class="tc-label">${b.label}</div>
        <div class="tc-avg">${b.avg ? b.avg.toFixed(1) + ' / 5' : 'No data'}</div>
        ${b.avg !== null && b.avg === maxAvg ? '<div class="best-badge">✦ BEST</div>' : ''}
      </div>`).join('');
  }
  const happiestEl = document.getElementById('insightHappiestTime');
  const happiest = avgs.filter(b => b.avg !== null).sort((a, b) => b.avg - a.avg)[0];
  if (happiestEl && happiest) happiestEl.textContent = `${happiest.icon} ${happiest.label}`;
}

function renderInsightStats() {
  const moods = getMoods();
  const last30 = getLast30DaysData();
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('insightTotal', last30.reduce((s, d) => s + d.count, 0));
  set('insightOverallAvg', moods.length ? (moods.reduce((s, m) => s + m.score, 0) / moods.length).toFixed(1) : '—');
  const byDay = {};
  moods.forEach(m => { const k = new Date(m.timestamp).toDateString(); if (!byDay[k]) byDay[k] = []; byDay[k].push(m.score); });
  let bestDay = null, bestScore = 0;
  Object.entries(byDay).forEach(([k, scores]) => { const avg = scores.reduce((s, v) => s + v, 0) / scores.length; if (avg > bestScore) { bestScore = avg; bestDay = k; } });
  set('insightBestDay', bestDay ? new Date(bestDay).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : '—');
}

/* ────────────────────────────────────────────────────────
   NEW — Wellness Recommendations
──────────────────────────────────────────────────────── */
const WELLNESS_RECOMMENDATIONS = {
  1: [
    { icon:'🌬️', title:'Breathe First', desc:'A 4-7-8 session reduces cortisol in under 3 minutes.', link:'breathe.html', cta:'Try Breathing' },
    { icon:'💬', title:'Talk to AI', desc:'Placida listens without judgment — just say what\'s on your mind.', link:'chatbot.html', cta:'Open Chat' },
    { icon:'🆘', title:'Need Real Support?', desc:'Free, confidential helplines available 24/7.', link:'#', cta:'See Helplines', onclick:'openSOS()' },
    { icon:'🎮', title:'Worry Crusher', desc:'Write your worry and symbolically destroy it.', link:'relax.html', cta:'Relax' },
  ],
  2: [
    { icon:'🧘', title:'5-Min Meditation', desc:'A short mindfulness session lifts mood and quiets mental chatter.', link:'meditation.html', cta:'Meditate' },
    { icon:'📓', title:'Write It Out', desc:'Journaling for 5 minutes reduces emotional intensity.', link:'journal.html', cta:'Journal' },
    { icon:'🌬️', title:'Breathe', desc:'Your nervous system responds quickly to conscious breathing.', link:'breathe.html', cta:'Breathe' },
    { icon:'🎨', title:'Zen Canvas', desc:'Free-form drawing quiets anxiety and activates calm creativity.', link:'relax.html', cta:'Draw' },
  ],
  3: [
    { icon:'📊', title:'Check Trends', desc:'See patterns in when and why your mood shifts.', link:'insights.html', cta:'Insights' },
    { icon:'🎯', title:'Today\'s Challenge', desc:'Complete a small wellness challenge to build momentum.', link:'community.html', cta:'Community' },
    { icon:'📓', title:'Reflect', desc:'Write a short gratitude entry — it compounds over time.', link:'journal.html', cta:'Journal' },
    { icon:'🎵', title:'Sound Therapy', desc:'ASMR ambient sounds gently shift your mental state.', link:'meditation.html', cta:'Try ASMR' },
  ],
  4: [
    { icon:'🔥', title:'Keep Your Streak', desc:'You\'re doing well! Log again tomorrow.', link:'index.html', cta:'Log Mood' },
    { icon:'🌍', title:'Share Positivity', desc:'Drop an encouraging message on the community wall.', link:'community.html', cta:'Community' },
    { icon:'📓', title:'Capture This Feeling', desc:'Journal about what made today good.', link:'journal.html', cta:'Journal' },
    { icon:'🧘', title:'Deepen Practice', desc:'A 10-minute meditation turns a good day into a great one.', link:'meditation.html', cta:'Meditate' },
  ],
  5: [
    { icon:'🌟', title:'You\'re Thriving!', desc:'Note what made today great — your future self will thank you.', link:'journal.html', cta:'Capture It' },
    { icon:'💌', title:'Pay It Forward', desc:'Send someone a kind message or share encouragement.', link:'community.html', cta:'Community' },
    { icon:'🔥', title:'Streak is Going!', desc:'Build on this momentum. Log again tomorrow!', link:'index.html', cta:'Log Tomorrow' },
    { icon:'📊', title:'See Your Progress', desc:'Check how far you\'ve come on your journey.', link:'insights.html', cta:'Insights' },
  ],
};

function renderWellnessRecommendations() {
  const container = document.getElementById('wellnessRecommendations');
  if (!container) return;
  const moods = getMoods();
  const last = moods[0];
  const score = last ? last.score : 3;
  const recs = WELLNESS_RECOMMENDATIONS[score] || WELLNESS_RECOMMENDATIONS[3];
  const moodLabels = { 1:'Rough 😔', 2:'Low 😟', 3:'Okay 😐', 4:'Good 🙂', 5:'Great 😊' };
  container.innerHTML = `
    <div style="font-size:.78rem;color:var(--text-muted);margin-bottom:14px">
      Based on your last mood: <strong style="color:var(--text-primary)">${moodLabels[score]}</strong>
      ${last ? `· logged ${formatTime(last.timestamp)}` : ''}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      ${recs.map(r => `
        <a href="${r.link}" ${r.onclick ? `onclick="${r.onclick};return false;"` : ''} class="action-card" style="display:flex;flex-direction:column;gap:6px;text-decoration:none" aria-label="${r.title}">
          <div style="font-size:1.5rem">${r.icon}</div>
          <div class="action-title">${r.title}</div>
          <div class="action-desc">${r.desc}</div>
          <div style="font-size:.7rem;font-weight:700;color:var(--accent-purple);margin-top:2px">${r.cta} →</div>
        </a>`).join('')}
    </div>`;
}

/* ── Streak Milestones ── */
const STREAK_MILESTONES = [
  { days: 3,   emoji: '🌱', label: 'Seedling', msg: '3-day streak! You\'re building a habit.' },
  { days: 7,   emoji: '🔥', label: 'On Fire',  msg: '7 days straight! You\'re on a roll.' },
  { days: 14,  emoji: '⚡', label: 'Electric', msg: '2 weeks! Your consistency is inspiring.' },
  { days: 30,  emoji: '🏆', label: 'Champion', msg: '30 days! That\'s incredible dedication.' },
  { days: 50,  emoji: '💎', label: 'Diamond',  msg: '50 days! You\'re truly committed.' },
  { days: 100, emoji: '👑', label: 'Legend',   msg: '100 days! You are a wellness legend.' },
];

function renderStreakMilestone() {
  const container = document.getElementById('streakMilestone');
  if (!container) return;
  const streak = computeStreak(getMoods());
  if (!streak) {
    container.innerHTML = `<div style="text-align:center;padding:16px;color:var(--text-muted);font-size:.85rem">Log your first mood to start a streak! 🌱</div>`;
    return;
  }
  const achieved = STREAK_MILESTONES.filter(m => streak >= m.days);
  const next = STREAK_MILESTONES.find(m => streak < m.days);
  const current = achieved[achieved.length - 1];
  const pct = next ? Math.round((streak / next.days) * 100) : 100;
  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
      <div style="font-size:2.5rem;flex-shrink:0">${current ? current.emoji : '🌱'}</div>
      <div style="flex:1;min-width:140px">
        <div style="font-size:.92rem;font-weight:700;color:var(--text-primary);margin-bottom:3px">🔥 ${streak}-Day Streak ${current ? `· ${current.label}` : ''}</div>
        ${next ? `<div style="font-size:.73rem;color:var(--text-muted);margin-bottom:8px">${next.days - streak} more day${next.days - streak !== 1 ? 's' : ''} to unlock ${next.emoji} ${next.label}</div>
        <div style="height:5px;background:rgba(255,255,255,.07);border-radius:100px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--accent-purple),var(--accent-teal));border-radius:100px;transition:width .8s cubic-bezier(.34,1.28,.64,1)"></div>
        </div>` : `<div style="font-size:.73rem;color:var(--accent-teal)">👑 You've unlocked every milestone!</div>`}
      </div>
    </div>
    ${achieved.length > 1 ? `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">${achieved.map(m => `<div style="padding:4px 10px;border-radius:100px;background:rgba(124,106,247,.15);border:1px solid rgba(124,106,247,.25);font-size:.68rem;font-weight:700;color:#a89df9" title="${m.msg}">${m.emoji} ${m.label}</div>`).join('')}</div>` : ''}`;

  const lastShown = localStorage.getItem('placida_last_milestone_shown');
  if (current && lastShown !== String(current.days) && streak === current.days) {
    setTimeout(() => showToast(current.emoji + ' ' + current.msg), 1000);
    localStorage.setItem('placida_last_milestone_shown', String(current.days));
  }
}

/* ── Daily Quote ── */
const DAILY_QUOTES = [
  { q: '"The greatest revolution of our generation is the discovery that by changing the inner attitudes of their minds, people can change the outer aspects of their lives."', a: 'William James' },
  { q: '"You don\'t have to control your thoughts. You just have to stop letting them control you."', a: 'Dan Millman' },
  { q: '"Almost everything will work again if you unplug it for a few minutes, including you."', a: 'Anne Lamott' },
  { q: '"Healing is not linear. Some days you\'ll feel great and some days you won\'t. Both are valid."', a: 'Unknown' },
  { q: '"You are allowed to be both a masterpiece and a work in progress simultaneously."', a: 'Sophia Bush' },
  { q: '"Sometimes the bravest thing you can do is ask for help."', a: 'Unknown' },
  { q: '"Breathe. You are exactly where you need to be."', a: 'Unknown' },
  { q: '"Self-care is how you take your power back."', a: 'Lalah Delia' },
  { q: '"Be gentle with yourself. You are a child of the universe, no less than the trees and the stars."', a: 'Max Ehrmann' },
  { q: '"Start where you are. Use what you have. Do what you can."', a: 'Arthur Ashe' },
  { q: '"The only journey is the one within."', a: 'Rainer Maria Rilke' },
  { q: '"Mental health is not a destination but a process. It\'s about how you drive, not where you\'re going."', a: 'Noam Shpancer' },
  { q: '"Rest is not a reward for finishing your work. Rest is what makes doing the work possible."', a: 'Unknown' },
  { q: '"It\'s okay to not have it all figured out. Just take it one day at a time."', a: 'Unknown' },
];

function renderDailyQuote() {
  const container = document.getElementById('dailyQuote');
  if (!container) return;
  const dayIdx = Math.floor(Date.now() / 86400000) % DAILY_QUOTES.length;
  const q = DAILY_QUOTES[dayIdx];
  container.innerHTML = `
    <div style="font-size:1.4rem;color:rgba(124,106,247,.4);margin-bottom:8px">"</div>
    <div style="font-size:.88rem;color:var(--text-primary);line-height:1.7;font-style:italic;margin-bottom:10px">${q.q}</div>
    <div style="font-size:.72rem;color:var(--text-muted);font-weight:600">— ${q.a}</div>`;
}

/* ── Reminder System ── */
function initReminders() {
  const container = document.getElementById('reminderPanel');
  if (!container) return;
  const enabled = localStorage.getItem('placida_reminders') === 'on';
  const time = localStorage.getItem('placida_reminder_time') || '20:00';
  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
      <div style="flex:1;min-width:160px">
        <div style="font-size:.88rem;font-weight:600;color:var(--text-primary);margin-bottom:3px">Daily Mood Reminder</div>
        <div style="font-size:.75rem;color:var(--text-muted)">Get a gentle nudge to log your mood each day</div>
      </div>
      <input type="time" id="reminderTime" value="${time}" style="background:rgba(255,255,255,.06);border:1px solid var(--border-glass);border-radius:8px;padding:6px 10px;color:var(--text-primary);font-family:Inter,sans-serif;font-size:.82rem;outline:none" onchange="updateReminderTime(this.value)"/>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="position:relative;width:42px;height:24px;cursor:pointer" onclick="toggleReminder(${!enabled})">
          <div style="position:absolute;inset:0;border-radius:100px;background:${enabled ? 'linear-gradient(135deg,var(--accent-purple),var(--accent-teal))' : 'rgba(255,255,255,.1)'};transition:background .3s;border:1px solid var(--border-glass)">
            <div style="position:absolute;width:18px;height:18px;border-radius:50%;background:#fff;top:2px;left:${enabled ? '20px' : '2px'};transition:left .3s;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>
          </div>
        </div>
        <span style="font-size:.8rem;color:var(--text-muted)">${enabled ? 'On' : 'Off'}</span>
      </div>
    </div>
    ${enabled ? `<div style="font-size:.72rem;color:var(--accent-teal);margin-top:10px">✓ Reminder set for ${time} every day</div>` : ''}`;
}

function toggleReminder(wantOn) {
  if (wantOn && 'Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission().then(perm => {
      if (perm === 'granted') { localStorage.setItem('placida_reminders', 'on'); scheduleReminder(); showToast('🔔 Daily reminder enabled!'); }
      else showToast('⚠️ Allow notifications in browser settings');
      initReminders();
    });
  } else {
    localStorage.setItem('placida_reminders', wantOn ? 'on' : 'off');
    if (wantOn) scheduleReminder();
    showToast(wantOn ? '🔔 Daily reminder enabled!' : '🔕 Reminder disabled');
    initReminders();
  }
}

function updateReminderTime(val) {
  localStorage.setItem('placida_reminder_time', val);
  if (localStorage.getItem('placida_reminders') === 'on') showToast(`🔔 Reminder updated to ${val}`);
}

function scheduleReminder() {
  const time = localStorage.getItem('placida_reminder_time') || '20:00';
  const [h, m] = time.split(':').map(Number);
  const now = new Date(), next = new Date();
  next.setHours(h, m, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  setTimeout(() => {
    if (localStorage.getItem('placida_reminders') === 'on' && Notification.permission === 'granted') {
      new Notification('Placida 🧠', { body: 'Time for your daily mood check-in! How are you feeling?', icon: 'icon-512.png' });
      scheduleReminder();
    }
  }, next - now);
}

/* ── AI Pattern Analysis ── */
async function generateAIInsight() {
  const container = document.getElementById('aiInsightCard');
  if (!container) return;
  const moods = getMoods();
  if (moods.length < 5) {
    container.innerHTML = `<div style="color:var(--text-muted);font-size:.88rem;text-align:center;padding:20px">Log at least 5 moods to unlock AI pattern analysis 🔒</div>`;
    return;
  }
  container.innerHTML = `<div style="color:var(--text-muted);font-size:.85rem;font-style:italic">Analyzing your mood patterns…</div>`;
  const last30 = moods.slice(0, 30);
  const avgScore = (last30.reduce((s, m) => s + m.score, 0) / last30.length).toFixed(1);
  const moodCounts = last30.reduce((acc, m) => { acc[m.label] = (acc[m.label] || 0) + 1; return acc; }, {});
  const streak = computeStreak(moods);
  const summary = JSON.stringify({ total: last30.length, avgScore, moodCounts, streak });
  const GEMINI_KEY = 'AIzaSyB4oRRi1gNFEQz6LRJ2lIOFMkCEFCQ6y_4';
  const prompt = `You are a compassionate wellness AI. User's mood data (last 30 days): ${summary}. Write a warm, personal 4-sentence analysis: (1) Acknowledge their overall pattern with empathy, (2) Point out something positive, (3) Note any concern or celebrate stability, (4) Give ONE specific, actionable recommendation. End with encouragement. Conversational and warm. Address them directly.`;
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (text) {
      container.innerHTML = '';
      const el = document.createElement('div');
      el.style.cssText = 'font-size:.88rem;color:var(--text-primary);line-height:1.8';
      container.appendChild(el);
      let i = 0;
      const interval = setInterval(() => { el.textContent = text.slice(0, i); i += 4; if (i > text.length) { el.textContent = text; clearInterval(interval); } }, 15);
    } else throw new Error('no text');
  } catch {
    container.innerHTML = `<div style="font-size:.85rem;color:var(--text-soft);line-height:1.7">You've logged ${moods.length} mood entries — that's a meaningful commitment to self-awareness. Your ${streak}-day streak shows real consistency. Keep going! 🌟</div>`;
  }
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => selectMood(btn.dataset.mood));
  });

  renderGreetingWithAuth();
  renderMoodHistory();
  renderStats();
  renderMoodChart();
  renderWellnessRecommendations();
  renderStreakMilestone();
  renderDailyQuote();
  initReminders();

  const modal = document.getElementById('confirmModal');
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) cancelClear(); });

  if (document.getElementById('moodHeatmap')) {
    renderInsightStats();
    renderHeatmap();
    renderWeekdayAnalysis();
    renderTimeBuckets();
    setTimeout(generateAIInsight, 600);
  }

  checkOnboarding();
  initKeyboardShortcuts();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }

  if (localStorage.getItem('placida_reminders') === 'on' && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    scheduleReminder();
  }

  // Mobile Bottom Nav
  (function injectMobileNav() {
    if (document.getElementById('mobileBottomNav')) return;
    const cur = window.location.pathname.split('/').pop() || 'index.html';
    const act = (p) => cur === p ? 'active' : '';
    const nav = document.createElement('nav');
    nav.id = 'mobileBottomNav';
    nav.className = 'mobile-bottom-nav';
    nav.setAttribute('aria-label', 'Mobile navigation');
    nav.innerHTML = `
      <a href="index.html"      class="mob-nav-item ${act('index.html')}"><span class="mob-nav-icon">🏠</span><span>Home</span></a>
      <a href="breathe.html"    class="mob-nav-item ${act('breathe.html')}"><span class="mob-nav-icon">🌬️</span><span>Breathe</span></a>
      <a href="meditation.html" class="mob-nav-item ${act('meditation.html')}"><span class="mob-nav-icon">🧘</span><span>Meditate</span></a>
      <a href="chatbot.html"    class="mob-nav-item ${act('chatbot.html')}"><span class="mob-nav-icon">💬</span><span>Chat</span></a>
      <a href="journal.html"    class="mob-nav-item ${act('journal.html')}"><span class="mob-nav-icon">📓</span><span>Journal</span></a>
      <a href="dashboard.html"  class="mob-nav-item ${act('dashboard.html')}" id="mobDashLink"><span class="mob-nav-icon">📊</span><span>Stats</span></a>
      <button class="mob-nav-item mob-nav-install" id="mobInstallBtn" style="display:none;" aria-label="Install app"><span class="mob-nav-icon">📲</span><span>Install</span></button>
    `;
    document.body.appendChild(nav);
  })();

  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); deferredPrompt = e;
    const mobBtn = document.getElementById('mobInstallBtn');
    if (mobBtn) {
      mobBtn.style.display = 'flex';
      mobBtn.addEventListener('click', async () => { if (deferredPrompt) { deferredPrompt.prompt(); await deferredPrompt.userChoice; mobBtn.style.display = 'none'; deferredPrompt = null; } }, { once: true });
    }
    if (!document.getElementById('pwaInstallBtn')) {
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) {
        const li = document.createElement('li');
        li.innerHTML = '<button id="pwaInstallBtn" class="btn-secondary" style="padding:6px 14px;font-size:0.8rem;border-radius:8px;">📲 Install</button>';
        navLinks.appendChild(li);
        li.querySelector('button').addEventListener('click', async () => { if (deferredPrompt) { deferredPrompt.prompt(); await deferredPrompt.userChoice; li.remove(); deferredPrompt = null; } });
      }
    }
  });
});