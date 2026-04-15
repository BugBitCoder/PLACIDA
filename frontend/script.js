/* ============================================
   PLACIDA — script.js
   Week 1 + Week 2 Frontend Logic — Sahil
   Uses localStorage (no backend needed yet)
   ============================================ */

// ── Mood data for emoji picker ──
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

/* ─────────────────────────────────────────────
   SHARED UTILITIES
───────────────────────────────────────────── */

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
  const diff = (Date.now() - date) / 1000;
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/* ─────────────────────────────────────────────
   WEEK 1 — Mood Logger (index.html)
───────────────────────────────────────────── */

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
    id:        Date.now(),
    emoji:     selectedMood.emoji,
    label:     selectedMood.label,
    score:     selectedMood.score,
    note:      note || '',
    timestamp: new Date().toISOString(),
  };

  const existing = getMoods();
  existing.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

  selectedMood = null;
  document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
  if (noteInput) noteInput.value = '';
  showToast('✨ Mood saved! Keep going.');
}

/* ─────────────────────────────────────────────
   WEEK 1 — Dashboard stats & history
───────────────────────────────────────────── */

function computeWeeklySummary(moods) {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = moods.filter(m => new Date(m.timestamp).getTime() > cutoff);
  if (!recent.length) return { count: 0, avg: null, trend: '—' };
  const avg   = recent.reduce((s, m) => s + m.score, 0) / recent.length;
  const trend = avg >= 4 ? '📈 Positive' : avg >= 3 ? '➡️ Stable' : '📉 Needs care';
  return { count: recent.length, avg: avg.toFixed(1), trend };
}

function renderStats() {
  const moods   = getMoods();
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
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-emoji">💭</div>
        <p>No moods logged yet.<br>Head to the home page to log your first one!</p>
      </div>`;
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

/* ─────────────────────────────────────────────
   WEEK 2 — Time-aware Greeting + Streak
───────────────────────────────────────────── */

function getGreetingPrefix() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return 'Good morning';
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

function renderGreeting() {
  const greetEl = document.getElementById('dashGreeting');
  if (greetEl) greetEl.innerHTML = `${getGreetingPrefix()}, <span>Sahil</span> 👋`;

  const streak = computeStreak(getMoods());
  const subEl  = document.getElementById('dashGreetingSub');
  if (subEl) {
    subEl.innerHTML = streak > 0
      ? `Here's your emotional wellness snapshot. &nbsp;<span class="streak-badge">🔥 ${streak}-day streak</span>`
      : `Here's your emotional wellness snapshot. Log a mood to start your streak!`;
  }
}

/* ─────────────────────────────────────────────
   WEEK 2 — 7-Day Mood Chart (Chart.js)
───────────────────────────────────────────── */

function getLast7DaysData() {
  const moods  = getMoods();
  const labels = [], data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString('en-IN', { weekday: 'short' }));
    const dayMoods = moods.filter(m => new Date(m.timestamp).toDateString() === d.toDateString());
    data.push(dayMoods.length
      ? parseFloat((dayMoods.reduce((s, m) => s + m.score, 0) / dayMoods.length).toFixed(1))
      : null);
  }
  return { labels, data };
}

function renderMoodChart() {
  const canvas   = document.getElementById('moodChart');
  const emptyMsg = document.getElementById('chartEmptyMsg');
  if (!canvas) return;

  const { labels, data } = getLast7DaysData();
  const hasData = data.some(d => d !== null);

  if (!hasData) {
    canvas.style.display = 'none';
    if (emptyMsg) emptyMsg.style.display = 'flex';
    return;
  }

  canvas.style.display = 'block';
  if (emptyMsg) emptyMsg.style.display = 'none';

  if (moodChartInstance) { moodChartInstance.destroy(); moodChartInstance = null; }

  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 240);
  gradient.addColorStop(0, 'rgba(124,106,247,0.9)');
  gradient.addColorStop(1, 'rgba(94,196,182,0.4)');

  moodChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label:           'Avg Mood',
        data,
        backgroundColor: gradient,
        borderRadius:    10,
        borderSkipped:   false,
      }],
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(13,15,26,0.95)',
          borderColor:     'rgba(124,106,247,0.4)',
          borderWidth:      1,
          titleColor:      '#f0f0ff',
          bodyColor:       '#8888aa',
          padding:          12,
          callbacks: {
            label: ctx => {
              const v = ctx.raw;
              if (v === null) return '  No entry';
              const em = v >= 4.5 ? '😊' : v >= 3.5 ? '🙂' : v >= 2.5 ? '😐' : v >= 1.5 ? '😟' : '😔';
              return `  ${em}  Score: ${v} / 5`;
            },
          },
        },
      },
      scales: {
        x: {
          grid:   { color: 'rgba(255,255,255,0.06)' },
          ticks:  { color: '#8888aa', font: { family: 'Inter', size: 12 } },
          border: { color: 'rgba(255,255,255,0.08)' },
        },
        y: {
          min:  0,
          max:  5,
          grid: { color: 'rgba(255,255,255,0.06)' },
          ticks: {
            color:    '#8888aa',
            stepSize: 1,
            font:     { family: 'Inter', size: 12 },
            callback: v => ['', '😔', '😟', '😐', '🙂', '😊'][v] || '',
          },
          border: { color: 'rgba(255,255,255,0.08)' },
        },
      },
    },
  });
}

/* ─────────────────────────────────────────────
   WEEK 2 — Clear All Data (with modal)
───────────────────────────────────────────── */

function clearAllData() {
  const modal = document.getElementById('confirmModal');
  if (modal) modal.classList.add('show');
}

function confirmClear() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('placida_chat');
  const modal = document.getElementById('confirmModal');
  if (modal) modal.classList.remove('show');
  renderGreeting();
  renderMoodHistory();
  renderStats();
  renderMoodChart();
  showToast('🗑️ All data cleared.');
}

function cancelClear() {
  const modal = document.getElementById('confirmModal');
  if (modal) modal.classList.remove('show');
}

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  // Index page — emoji picker
  document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => selectMood(btn.dataset.mood));
  });

  // Dashboard page
  renderGreeting();
  renderMoodHistory();
  renderStats();
  renderMoodChart();

  // Close modal on backdrop click
  const modal = document.getElementById('confirmModal');
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) cancelClear(); });
});