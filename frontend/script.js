/* ============================================
   PLACIDA — script.js
   Week 1 Frontend Logic — Sahil
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

// Storage key
const STORAGE_KEY = 'placida_moods';

// Currently selected mood on index page
let selectedMood = null;

// ── Show toast message ──
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ── Select a mood emoji ──
function selectMood(moodId) {
  selectedMood = MOODS.find(m => m.id === moodId);
  document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.mood === moodId);
  });
}

// ── Save mood to localStorage ──
function saveMood() {
  if (!selectedMood) {
    showToast('💜 Please pick a mood first!');
    return;
  }

  const noteInput = document.getElementById('moodNote');
  const note = noteInput ? noteInput.value.trim() : '';

  const entry = {
    id:        Date.now(),
    emoji:     selectedMood.emoji,
    label:     selectedMood.label,
    score:     selectedMood.score,
    note:      note || '',
    timestamp: new Date().toISOString(),
  };

  const existing = getMoods();
  existing.unshift(entry); // newest first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

  // Reset UI
  selectedMood = null;
  document.querySelectorAll('.emoji-btn').forEach(btn => btn.classList.remove('selected'));
  if (noteInput) noteInput.value = '';

  showToast('✨ Mood saved! Keep going.');
}

// ── Get all moods from localStorage ──
function getMoods() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

// ── Format a timestamp for display ──
function formatTime(isoString) {
  const date = new Date(isoString);
  const now  = new Date();
  const diff = (now - date) / 1000; // seconds

  if (diff < 60)     return 'Just now';
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;

  return date.toLocaleDateString('en-IN', {
    day:   'numeric',
    month: 'short',
  });
}

// ── Compute weekly summary ──
function computeWeeklySummary(moods) {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = moods.filter(m => new Date(m.timestamp).getTime() > oneWeekAgo);
  if (recent.length === 0) return { count: 0, avg: null, trend: '—' };
  const avg = recent.reduce((sum, m) => sum + m.score, 0) / recent.length;
  const trend = avg >= 4 ? '📈 Positive' : avg >= 3 ? '➡️ Stable' : '📉 Needs care';
  return { count: recent.length, avg: avg.toFixed(1), trend };
}

// ── Render mood history on dashboard ──
function renderMoodHistory() {
  const container = document.getElementById('moodHistory');
  if (!container) return;

  const moods = getMoods();

  if (moods.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-emoji">💭</div>
        <p>No moods logged yet.<br>Head to the home page to log your first one!</p>
      </div>`;
    return;
  }

  // Show recent 10 entries
  const recent = moods.slice(0, 10);
  container.innerHTML = recent.map(entry => `
    <div class="mood-entry">
      <div class="entry-emoji">${entry.emoji}</div>
      <div class="entry-info">
        <div class="entry-mood">${entry.label}</div>
        ${entry.note ? `<div class="entry-note">${escapeHtml(entry.note)}</div>` : ''}
      </div>
      <div class="entry-time">${formatTime(entry.timestamp)}</div>
    </div>
  `).join('');
}

// ── Render dashboard stats ──
function renderStats() {
  const moods = getMoods();
  const summary = computeWeeklySummary(moods);

  const el = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  el('statTotal',  moods.length.toString());
  el('statWeek',   summary.count.toString());
  el('statAvg',    summary.avg ? summary.avg : '—');
  el('statTrend',  summary.trend);
}

// ── Escape HTML for safety ──
function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

// ── Init on page load ──
document.addEventListener('DOMContentLoaded', () => {
  // Attach emoji click handlers (index page)
  document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => selectMood(btn.dataset.mood));
  });

  // Dashboard page
  renderMoodHistory();
  renderStats();
});