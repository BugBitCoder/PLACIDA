/* ============================================
   PLACIDA — features.js
   Week 1 + Week 2 + Week 3 Logic — Sanchari
   Breathing Timer | Chatbot | Weekly Summary
   Ambient Sound | Mindfulness Page
   ============================================ */

/* ══════════════════════════════════════════════════
   SECTION 1 — BREATHING TIMER (Week 1 + Week 2)
   Patterns: 4-7-8 | Box (4-4-4-4) | Simple (4-4)
   + Session history saved to localStorage
   ══════════════════════════════════════════════════ */

const BREATH_PATTERNS = {
  '478': {
    name:  '4-7-8',
    tip:   'Best for anxiety relief and falling asleep. Do 3–4 cycles for full effect 📚',
    phases: [
      { label: 'Inhale',  emoji: '🌬️', duration: 4, color: '#7c6af7', icon: '🌬️', desc: '4 seconds — through nose' },
      { label: 'Hold',    emoji: '🤚', duration: 7, color: '#5ec4b6', icon: '🤚', desc: '7 seconds — hold gently' },
      { label: 'Exhale',  emoji: '💨', duration: 8, color: '#f06b8b', icon: '💨', desc: '8 seconds — through mouth' },
    ],
  },
  'box': {
    name: 'Box Breathing',
    tip:  'Used by Navy SEALs! Equalises your nervous system. Great for stress and focus 🎯',
    phases: [
      { label: 'Inhale',  emoji: '⬆️', duration: 4, color: '#7c6af7', icon: '🌬️', desc: '4 seconds — through nose' },
      { label: 'Hold In', emoji: '➡️', duration: 4, color: '#5ec4b6', icon: '🤚', desc: '4 seconds — hold' },
      { label: 'Exhale',  emoji: '⬇️', duration: 4, color: '#f06b8b', icon: '💨', desc: '4 seconds — through mouth' },
      { label: 'Hold Out',emoji: '⬅️', duration: 4, color: '#f0a06b', icon: '⏸️', desc: '4 seconds — hold empty' },
    ],
  },
  'simple': {
    name: 'Simple Calm',
    tip:  'A gentle 4-4 rhythm — perfect for beginners or a quick reset anytime 🌿',
    phases: [
      { label: 'Inhale',  emoji: '🌱', duration: 4, color: '#7c6af7', icon: '🌬️', desc: '4 seconds — breathe in slowly' },
      { label: 'Exhale',  emoji: '🍃', duration: 4, color: '#5ec4b6', icon: '💨', desc: '4 seconds — breathe out slowly' },
    ],
  },
};

const STORAGE_KEY_SESSIONS = 'placida_breathe_sessions';

let breathInterval   = null;
let breathPhaseIdx   = 0;
let breathCountdown  = 0;
let breathCycles     = 0;
let breathRunning    = false;
let currentPattern   = '478';

/* ── Pattern switching ── */
function selectPattern(patternKey) {
  if (breathRunning) stopBreathing();
  currentPattern = patternKey;

  // Update button states
  document.querySelectorAll('.pattern-btn').forEach(btn => {
    const active = btn.dataset.pattern === patternKey;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  // Update tip and phase steps
  renderPhaseSteps();
  updateTip();

  // Update pattern label in stats
  const labelEl = document.getElementById('breathPatternLabel');
  if (labelEl) labelEl.textContent = BREATH_PATTERNS[patternKey].name;

  resetBreathCircle();
}

function getPhases() {
  return BREATH_PATTERNS[currentPattern].phases;
}

function renderPhaseSteps() {
  const container = document.getElementById('phaseStepsContainer');
  if (!container) return;
  const phases = getPhases();
  container.innerHTML = phases.map((p, i) => `
    <div class="phase-step" id="phaseStep${i}">
      <div class="ps-icon">${p.icon}</div>
      <div class="ps-name">${p.label}</div>
      <div class="ps-dur">${p.desc}</div>
    </div>`).join('');
}

function updateTip() {
  const tipEl = document.getElementById('breathTip');
  if (!tipEl) return;
  tipEl.innerHTML = `<strong>Tip:</strong> ${BREATH_PATTERNS[currentPattern].tip}`;
}

function resetBreathCircle() {
  const label   = document.getElementById('breathLabel');
  const counter = document.getElementById('breathCounter');
  const circle  = document.getElementById('breathCircle');
  const cycles  = document.getElementById('breathCycles');
  const phase   = document.getElementById('breathPhase');
  if (label)   label.textContent   = 'Ready when you are';
  if (counter) counter.textContent = '';
  if (circle)  { circle.style.transform = 'scale(1)'; circle.style.boxShadow = '0 0 60px rgba(124,106,247,0.3)'; circle.style.borderColor = '#7c6af7'; }
  if (cycles)  cycles.textContent  = '0 cycles completed';
  if (phase)   phase.textContent   = '—';
}

/* ── Start / Stop ── */
function startBreathing() {
  if (breathRunning) return;
  breathRunning   = true;
  breathPhaseIdx  = 0;
  breathCycles    = 0;
  breathCountdown = getPhases()[0].duration;

  updateBreathUI();
  breathInterval = setInterval(breathTick, 1000);

  const btn = document.getElementById('breathBtn');
  if (btn) { btn.textContent = 'Stop Session'; btn.onclick = stopBreathing; }
}

function stopBreathing() {
  clearInterval(breathInterval);
  breathRunning = false;

  // Save session to localStorage if at least 1 cycle was done
  if (breathCycles > 0) {
    saveBreathSession(breathCycles, currentPattern);
    renderSessionHistory();
    showToast(`✨ Session saved! ${breathCycles} cycle${breathCycles !== 1 ? 's' : ''} completed.`);
  }

  resetBreathCircle();
  breathPhaseIdx  = 0;
  breathCountdown = getPhases()[0].duration;

  // Deactivate phase highlights
  document.querySelectorAll('.phase-step').forEach(el => el.classList.remove('active-phase'));

  const btn = document.getElementById('breathBtn');
  if (btn) { btn.textContent = 'Start Breathing'; btn.onclick = startBreathing; }
}

function breathTick() {
  breathCountdown--;
  updateBreathUI();

  if (breathCountdown <= 0) {
    const phases = getPhases();
    breathPhaseIdx = (breathPhaseIdx + 1) % phases.length;
    if (breathPhaseIdx === 0) breathCycles++;
    breathCountdown = phases[breathPhaseIdx].duration;
  }
}

function updateBreathUI() {
  const phases  = getPhases();
  const phase   = phases[breathPhaseIdx];
  const label   = document.getElementById('breathLabel');
  const counter = document.getElementById('breathCounter');
  const circle  = document.getElementById('breathCircle');
  const cycles  = document.getElementById('breathCycles');
  const phaseEl = document.getElementById('breathPhase');

  if (label)   label.textContent   = `${phase.emoji}  ${phase.label}`;
  if (counter) counter.textContent = breathCountdown + 's';
  if (cycles)  cycles.textContent  = `${breathCycles} cycle${breathCycles !== 1 ? 's' : ''} completed`;
  if (phaseEl) phaseEl.textContent = `Phase ${breathPhaseIdx + 1}/${phases.length}`;

  // Highlight active phase step card
  document.querySelectorAll('.phase-step').forEach((el, i) => {
    el.classList.toggle('active-phase', i === breathPhaseIdx);
  });

  if (circle) {
    if (phase.label === 'Inhale' || phase.label.startsWith('Inhale')) {
      circle.style.transform  = 'scale(1.35)';
      circle.style.boxShadow  = `0 0 80px rgba(124,106,247,0.55)`;
    } else if (phase.label.startsWith('Hold') || phase.label === 'Hold In') {
      circle.style.transform  = 'scale(1.35)';
      circle.style.boxShadow  = `0 0 80px rgba(94,196,182,0.55)`;
    } else if (phase.label === 'Hold Out') {
      circle.style.transform  = 'scale(0.85)';
      circle.style.boxShadow  = `0 0 60px rgba(240,160,107,0.5)`;
    } else {
      circle.style.transform  = 'scale(0.85)';
      circle.style.boxShadow  = `0 0 60px rgba(240,107,139,0.45)`;
    }
    circle.style.borderColor = phase.color;
  }
}

/* ── Session History (localStorage) ── */
function saveBreathSession(cycles, patternKey) {
  const sessions = getBreathSessions();
  sessions.unshift({
    id:        Date.now(),
    pattern:   BREATH_PATTERNS[patternKey].name,
    cycles,
    timestamp: new Date().toISOString(),
  });
  // Keep only last 30 sessions
  localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions.slice(0, 30)));
}

function getBreathSessions() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_SESSIONS)) || []; }
  catch { return []; }
}

function renderSessionHistory() {
  const logEl    = document.getElementById('sessionLog');
  const badgeEl  = document.getElementById('todaySummaryBadge');
  if (!logEl) return;

  const sessions = getBreathSessions();
  const todayStr = new Date().toDateString();
  const todaySessions = sessions.filter(s => new Date(s.timestamp).toDateString() === todayStr);

  // Today's summary badge
  if (todaySessions.length > 0 && badgeEl) {
    const totalCycles = todaySessions.reduce((sum, s) => sum + s.cycles, 0);
    document.getElementById('todayCycleCount').textContent   = totalCycles;
    document.getElementById('todaySessionCount').textContent = todaySessions.length;
    badgeEl.style.display = 'flex';
  } else if (badgeEl) {
    badgeEl.style.display = 'none';
  }

  if (sessions.length === 0) {
    logEl.innerHTML = `<div class="sh-empty">No sessions yet — press <em>Start Breathing</em> above to begin! 🌬️</div>`;
    return;
  }

  // Show last 10 sessions
  logEl.innerHTML = sessions.slice(0, 10).map(s => {
    const d   = new Date(s.timestamp);
    const ago = formatSessionTime(d);
    return `
      <div class="session-item">
        <span class="si-icon">🌬️</span>
        <div class="si-info">
          <div class="si-main">${s.cycles} cycle${s.cycles !== 1 ? 's' : ''} — ${s.pattern}</div>
          <div class="si-sub">${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div class="si-time">${ago}</div>
      </div>`;
  }).join('');
}

function formatSessionTime(date) {
  const now  = new Date();
  const diff = (now - date) / 1000;
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}


/* ══════════════════════════════════════
   SECTION 2 — CHATBOT (rule-based)
   ══════════════════════════════════════ */

const BOT_RULES = [
  { keys: ['anxious', 'anxiety', 'nervous', 'panic', 'worry', 'worried'],
    replies: [
      "I hear you. Anxiety can feel overwhelming. Would you like to try a quick breathing exercise? It really helps calm the nervous system 🌬️",
      "That's completely valid. Take a slow breath with me — inhale for 4 counts, hold for 7, exhale for 8. You've got this 💙",
      "Anxiety is your mind trying to protect you — but sometimes it overdoes it. Let's take this one moment at a time. What's on your mind?"
    ]
  },
  { keys: ['sad', 'crying', 'cry', 'depressed', 'hopeless', 'empty'],
    replies: [
      "I'm really sorry you're feeling this way. You don't have to go through it alone. I'm right here with you 💜",
      "It's okay to feel sad. Let yourself feel it — emotions are valid. Would you like to journal about it?",
      "Being sad doesn't mean something is broken about you. You're human, and this will pass. What happened today?"
    ]
  },
  { keys: ['happy', 'great', 'amazing', 'wonderful', 'excited', 'joy', 'good'],
    replies: [
      "That's so beautiful to hear! 😊 What made your day so good? I'd love to know!",
      "You deserve every bit of happiness! Celebrate yourself today 🎉",
      "Happiness looks great on you! Tell me what made you smile today."
    ]
  },
  { keys: ['stressed', 'stress', 'overwhelmed', 'pressure', 'burnout', 'exhausted'],
    replies: [
      "Stress can feel like carrying the whole world. Take a breath — you don't have to solve everything at once 🌿",
      "You're doing a lot. It's okay to pause. Try the 4-7-8 breathing on the Breathe page — it really works.",
      "Overwhelm often means you care a lot. But you matter more than any deadline. What can we let go of today?"
    ]
  },
  { keys: ['tired', 'sleep', 'exhausted', 'fatigue', 'sleepy'],
    replies: [
      "Rest is not a luxury, it's a necessity. Your body is telling you something important 💤",
      "Have you been sleeping okay? Sometimes our minds race too much. A breathing exercise before bed can help.",
      "Being tired often means you've been strong for too long. It's okay to rest today."
    ]
  },
  { keys: ['lonely', 'alone', 'isolated', 'no one', 'nobody'],
    replies: [
      "Feeling lonely is one of the hardest feelings. But I'm here, right now, with you 💙",
      "You reached out — that takes courage. You're not as alone as it might feel right now.",
      "Loneliness is painful. Would it help to write about what kind of connection you're missing?"
    ]
  },
  { keys: ['angry', 'anger', 'frustrated', 'rage', 'annoyed', 'mad'],
    replies: [
      "Anger is a completely valid emotion. It's telling you something bothered you. Want to talk about what happened?",
      "Let it out here — this is a safe space. What's frustrating you right now?",
      "Anger often hides hurt underneath. Take a breath, and when you're ready, tell me what's going on."
    ]
  },
  { keys: ['hi', 'hello', 'hey', 'hii', 'helo'],
    replies: [
      "Hey there! 👋 I'm Placida, your mental wellness companion. How are you feeling today?",
      "Hello! 😊 I'm so glad you're here. What's on your mind today?",
      "Hi! This is a safe space. How are you doing right now?"
    ]
  },
  { keys: ['thank', 'thanks', 'thankyou'],
    replies: [
      "Always here for you 💜 You're not alone in this.",
      "Of course! Take care of yourself today 🌿",
      "That means a lot. Remember — you deserve support too."
    ]
  },
  { keys: ['help', 'crisis', 'harm', 'hurt myself', 'end it', 'give up'],
    replies: [
      "⚠️ I'm really concerned about you right now. Please reach out to iCall: 9152987821 — they're free, confidential, and available to talk. You matter deeply.",
      "Please don't go through this alone. Call Vandrevala Foundation: 1860-2662-345 — they're available 24/7. I care about your safety 💙"
    ]
  },
];

const DEFAULT_REPLIES = [
  "I'm here and I'm listening. Tell me more about how you're feeling 💜",
  "Thank you for sharing that with me. Would you like to talk more about it?",
  "You're brave for expressing yourself. What else is on your mind?",
  "I may not have all the answers, but I'm here with you. What do you need right now?",
];

function getBotReply(message) {
  const lower = message.toLowerCase();
  for (const rule of BOT_RULES) {
    if (rule.keys.some(k => lower.includes(k))) {
      return rule.replies[Math.floor(Math.random() * rule.replies.length)];
    }
  }
  return DEFAULT_REPLIES[Math.floor(Math.random() * DEFAULT_REPLIES.length)];
}

function renderMessage(text, sender) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const wrapper = document.createElement('div');
  wrapper.className = `chat-msg ${sender}`;
  wrapper.innerHTML = `
    <div class="bubble">${escapeHtmlChat(text)}</div>
    <div class="msg-time">${formatChatTime()}</div>
  `;
  container.appendChild(wrapper);
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const typing = document.createElement('div');
  typing.className = 'chat-msg bot typing-indicator';
  typing.id = 'typingIndicator';
  typing.innerHTML = '<div class="bubble"><span></span><span></span><span></span></div>';
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function sendMessage() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  renderMessage(text, 'user');
  input.value = '';

  showTypingIndicator();
  setTimeout(() => {
    removeTypingIndicator();
    renderMessage(getBotReply(text), 'bot');
  }, 1200);
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function formatChatTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function escapeHtmlChat(text) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(text));
  return d.innerHTML;
}


/* ══════════════════════════════════════════════════
   SECTION 3 — WEEKLY SUMMARY (Week 1 + Week 2)
   + Emoji mood row for last 7 days
   + Save Journal Entry with timestamp
   ══════════════════════════════════════════════════ */

const STORAGE_KEY_MOODS    = 'placida_moods';
const STORAGE_KEY_JOURNALS = 'placida_journal_entries';

/* ── Day-name helpers ── */
const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

/* ── Emoji Mood Row ── */
function renderEmojiMoodRow(allMoods) {
  const container = document.getElementById('emojiMoodRow');
  if (!container) return;

  const days    = getLast7Days();
  const todayStr = new Date().toDateString();

  container.innerHTML = days.map(day => {
    const dayStr    = day.toDateString();
    const shortName = DAY_NAMES_SHORT[day.getDay()];
    const isToday   = dayStr === todayStr;

    // Find all moods for this day, pick last logged one
    const dayMoods = allMoods.filter(m => new Date(m.timestamp).toDateString() === dayStr);
    const lastMood = dayMoods.length > 0 ? dayMoods[0] : null; // already sorted newest-first

    return `
      <div class="emoji-day ${isToday ? 'today' : ''} ${lastMood ? 'has-entry' : ''}">
        <span class="ed-label">${isToday ? 'Today' : shortName}</span>
        ${lastMood
          ? `<span class="ed-emoji" title="${lastMood.label}">${lastMood.emoji}</span>`
          : `<span class="ed-empty ed-emoji">·</span>`}
        <div class="ed-dot"></div>
      </div>`;
  }).join('');
}

/* ── Rotating motivational quotes ── */
const WEEKLY_QUOTES = [
  { text: "You don't have to be positive all the time. It's okay to feel sad, angry, annoyed, or scared. Having feelings doesn't make you a negative person. It makes you human.", author: "Lori Deschene" },
  { text: "One small crack does not mean that you are broken, it means that you were put to the test and you didn't fall apart.", author: "Linda Poindexter" },
  { text: "Be gentle with yourself. You are a child of the universe, no less than the trees and the stars.", author: "Max Ehrmann" },
  { text: "You are allowed to be both a masterpiece and a work in progress simultaneously.", author: "Sophia Bush" },
  { text: "Healing is not linear. Rest, reset, and keep going at your own pace.", author: "Unknown" },
  { text: "Your mental health is a priority. Your happiness is an essential. Your self-care is a necessity.", author: "Unknown" },
  { text: "The strongest thing you can do is ask for help when you need it.", author: "Unknown" },
];

function renderMotivationalQuote() {
  const quoteEl  = document.getElementById('motivationalQuote');
  const authorEl = document.getElementById('motivationalAuthor');
  if (!quoteEl || !authorEl) return;
  const pick = WEEKLY_QUOTES[new Date().getDay() % WEEKLY_QUOTES.length];
  quoteEl.textContent  = `"${pick.text}"`;
  authorEl.textContent = `— ${pick.author}`;
}

/* ── Load Weekly Summary ── */
function loadWeeklySummary() {
  const allMoods = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_MOODS)) || []; }
    catch { return []; }
  })();

  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekly = allMoods.filter(m => new Date(m.timestamp).getTime() > oneWeekAgo);

  renderSummaryStats(weekly);
  renderPrompt(weekly);
  renderWeeklyHistory(weekly);
  renderEmojiMoodRow(allMoods);   // pass all moods so we can filter per-day
  renderMotivationalQuote();
  renderSavedJournalEntries();
}

function renderSummaryStats(moods) {
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  if (moods.length === 0) {
    setEl('summaryCount', '0');
    setEl('summaryAvg',   '—');
    setEl('summaryTop',   '—');
    setEl('summaryStreak', '0');
    return;
  }

  const avg = moods.reduce((s, m) => s + m.score, 0) / moods.length;

  // Most frequent mood
  const freq = {};
  moods.forEach(m => freq[m.emoji] = (freq[m.emoji] || 0) + 1);
  const topEmoji = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];

  // Unique days logged
  const days = [...new Set(moods.map(m => new Date(m.timestamp).toDateString()))];

  setEl('summaryCount',  moods.length.toString());
  setEl('summaryAvg',    avg.toFixed(1));
  setEl('summaryTop',    topEmoji);
  setEl('summaryStreak', days.length + ' day' + (days.length !== 1 ? 's' : ''));
}

function renderPrompt(moods) {
  const el = document.getElementById('journalPrompt');
  if (!el) return;

  let prompt;
  if (moods.length === 0) {
    prompt = "This is your space to reflect. Start logging moods on the home page — your summary will appear here 🌙";
  } else {
    const avg = moods.reduce((s, m) => s + m.score, 0) / moods.length;
    if (avg >= 4)
      prompt = "✨ You've had a wonderful week! What moments made it special? Write about one memory you want to hold onto.";
    else if (avg >= 3)
      prompt = "🌿 A solid, balanced week. What's one thing that could make next week even better? Take a moment to reflect.";
    else
      prompt = "💜 It's been a tough week, and that's okay. Be gentle with yourself. What's one small thing you need right now?";
  }

  el.textContent = prompt;
}

function renderWeeklyHistory(moods) {
  const container = document.getElementById('weeklyHistory');
  if (!container) return;

  if (moods.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-emoji">📅</div>
        <p>No entries this week.<br>Start logging on the home page!</p>
      </div>`;
    return;
  }

  container.innerHTML = moods.slice(0, 7).map(entry => {
    const d = new Date(entry.timestamp);
    const dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    return `
      <div class="mood-entry">
        <div class="entry-emoji">${entry.emoji}</div>
        <div class="entry-info">
          <div class="entry-mood">${entry.label}</div>
          ${entry.note ? `<div class="entry-note">${entry.note}</div>` : ''}
        </div>
        <div class="entry-time">${dayLabel}</div>
      </div>`;
  }).join('');
}

/* ── Save Journal Entry (Week 2 NEW) ── */
function saveJournalEntry() {
  const textarea = document.getElementById('weeklyJournal');
  const promptEl = document.getElementById('journalPrompt');
  if (!textarea) return;

  const text = textarea.value.trim();
  if (!text) {
    showToast('📝 Please write something before saving!');
    return;
  }

  const entries = getSavedJournalEntries();
  entries.unshift({
    id:        Date.now(),
    text,
    prompt:    promptEl ? promptEl.textContent : '',
    timestamp: new Date().toISOString(),
  });

  // Keep last 20 journal entries
  localStorage.setItem(STORAGE_KEY_JOURNALS, JSON.stringify(entries.slice(0, 20)));
  textarea.value = '';
  renderSavedJournalEntries();
  showToast('💾 Journal entry saved! 💜');
}

function getSavedJournalEntries() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_JOURNALS)) || []; }
  catch { return []; }
}

function renderSavedJournalEntries() {
  const container = document.getElementById('savedEntriesList');
  if (!container) return;

  const entries = getSavedJournalEntries();
  if (entries.length === 0) {
    container.innerHTML = `<div class="sei-empty">No saved entries yet. Write something and press <em>Save Entry</em> above! ✍️</div>`;
    return;
  }

  container.innerHTML = entries.slice(0, 10).map(e => {
    const d   = new Date(e.timestamp);
    const dateStr = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    return `
      <div class="saved-entry-item">
        <div class="sei-header">
          <span class="sei-date">📅 ${dateStr} · ${timeStr}</span>
        </div>
        ${e.prompt ? `<div class="sei-prompt">${e.prompt}</div>` : ''}
        <div class="sei-text">${escapeHtmlSummary(e.text)}</div>
      </div>`;
  }).join('');
}

function escapeHtmlSummary(text) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(text));
  return d.innerHTML;
}

/* ── Toast (shared with script.js but also defined here for pages that only load features.js) ── */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}


/* ══════════════════════════════════════════════════
   SECTION 4 — AMBIENT SOUND (Week 3)
   Rain | White Noise | Off
   Uses Web Audio API — zero external URLs
   ══════════════════════════════════════════════════ */

let _ambCtx          = null;
let _ambSourceNode   = null;
let _ambGainNode     = null;
let _ambCurrentType  = null;

function _getAmbCtx() {
  if (!_ambCtx) {
    _ambCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return _ambCtx;
}

/* ── Generate a loopable noise buffer ── */
function _makeNoiseBuffer(ctx, durationSec, applyPink) {
  const sr  = ctx.sampleRate;
  const buf = ctx.createBuffer(1, sr * durationSec, sr);
  const d   = buf.getChannelData(0);

  if (applyPink) {
    // Paul Kellet's pink-noise algorithm
    let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886*b0 + w*0.0555179;
      b1 = 0.99332*b1 + w*0.0750759;
      b2 = 0.96900*b2 + w*0.1538520;
      b3 = 0.86650*b3 + w*0.3104856;
      b4 = 0.55000*b4 + w*0.5329522;
      b5 = -0.7616*b5 - w*0.0168980;
      d[i] = (b0+b1+b2+b3+b4+b5+b6+w*0.5362) / 7;
      b6 = w * 0.115926;
    }
  } else {
    // White noise
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return buf;
}

/* ── Build Rain sound: pink-noise + lowpass filter ── */
function _playRain(ctx) {
  const buf    = _makeNoiseBuffer(ctx, 3, true);
  const source = ctx.createBufferSource();
  source.buffer = buf;
  source.loop   = true;

  const lpf = ctx.createBiquadFilter();
  lpf.type            = 'lowpass';
  lpf.frequency.value = 700;
  lpf.Q.value         = 0.4;

  const gain = ctx.createGain();
  gain.gain.value = 0.22;

  source.connect(lpf);
  lpf.connect(gain);
  gain.connect(ctx.destination);
  source.start(0);
  return { source, gain };
}

/* ── Build White Noise: flat spectrum ── */
function _playWhiteNoise(ctx) {
  const buf    = _makeNoiseBuffer(ctx, 2, false);
  const source = ctx.createBufferSource();
  source.buffer = buf;
  source.loop   = true;

  const gain = ctx.createGain();
  gain.gain.value = 0.12;

  source.connect(gain);
  gain.connect(ctx.destination);
  source.start(0);
  return { source, gain };
}

/* ── Public: select ambient sound ── */
function setAmbientSound(type) {
  // Stop any running node
  if (_ambSourceNode) {
    try { _ambSourceNode.stop(); } catch(_) {}
    _ambSourceNode = null;
    _ambGainNode   = null;
  }

  // Update button states
  document.querySelectorAll('.sound-btn').forEach(btn => {
    const isActive = btn.dataset.sound === type;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  _ambCurrentType = type;

  if (type === 'off') {
    localStorage.removeItem('placida_sound');
    return;
  }

  try {
    const ctx = _getAmbCtx();
    if (ctx.state === 'suspended') ctx.resume();

    let nodes;
    if (type === 'rain')  nodes = _playRain(ctx);
    if (type === 'white') nodes = _playWhiteNoise(ctx);

    if (nodes) {
      _ambSourceNode = nodes.source;
      _ambGainNode   = nodes.gain;
      localStorage.setItem('placida_sound', type);
    }
  } catch (err) {
    console.warn('[Placida] AudioContext error:', err);
    showToast('⚠️ Audio not supported on this browser');
  }
}

/* ── Restore saved sound preference ── */
function restoreSoundPreference() {
  const saved = localStorage.getItem('placida_sound');
  if (saved && saved !== 'off') {
    // Delay so AudioContext is created after a user-gesture has occurred
    // (gesture requirement satisfied by page load on most modern browsers)
    setTimeout(() => setAmbientSound(saved), 300);
  }
}


/* ══════════════════════════════════════════════════
   SECTION 5 — MINDFUL PAGE (Week 3)
   Daily Affirmation Deck | Gratitude Prompt
   ══════════════════════════════════════════════════ */

const AFFIRMATIONS = [
  "You are enough, exactly as you are right now. Your worth is not measured by your productivity.",
  "Every breath you take is a gentle reminder that you are still here, still growing, still worthy.",
  "It's okay to not be okay. Healing isn't linear — and today, you're doing the best you can.",
  "You have survived every difficult day so far. That is something worth celebrating.",
  "Your feelings are valid. You don't need to justify why you feel the way you do.",
  "Small steps are still steps forward. Progress, no matter how quiet, is still progress.",
  "You deserve the same kindness and compassion you so freely give to others.",
  "Rest is not a reward — it is a necessity. You are allowed to pause and just be.",
  "Your mind, your heart, and your body are working hard for you. Be gentle with them today.",
  "Today, choose one small act of self-care. You are worth every moment of it."
];

const STORAGE_KEY_AFF      = 'placida_affirmation_idx';
const STORAGE_KEY_GRATITUDE = 'placida_gratitude';

let _currentAffIdx = 0;

/* ── Pick today's affirmation index (same all day) ── */
function _todayAffIdx() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  return dayOfYear % AFFIRMATIONS.length;
}

function initAffirmationDeck() {
  const todayIdx = _todayAffIdx();

  // Restore saved index or fall back to today's pick
  const saved = parseInt(localStorage.getItem(STORAGE_KEY_AFF), 10);
  _currentAffIdx = Number.isFinite(saved) ? saved : todayIdx;

  renderAffirmation(todayIdx);
  renderAffDots();

  const nextBtn  = document.getElementById('nextAffirmationBtn');
  const todayBtn = document.getElementById('todayAffirmationBtn');

  if (nextBtn) nextBtn.addEventListener('click', () => {
    _currentAffIdx = (_currentAffIdx + 1) % AFFIRMATIONS.length;
    localStorage.setItem(STORAGE_KEY_AFF, _currentAffIdx);
    renderAffirmation(todayIdx);
    renderAffDots();
  });

  if (todayBtn) todayBtn.addEventListener('click', () => {
    _currentAffIdx = todayIdx;
    localStorage.setItem(STORAGE_KEY_AFF, _currentAffIdx);
    renderAffirmation(todayIdx);
    renderAffDots();
  });
}

function renderAffirmation(todayIdx) {
  const card    = document.getElementById('affirmationCard');
  const textEl  = document.getElementById('affirmationText');
  const badge   = document.getElementById('todayBadge');
  const counter = document.getElementById('affCounter');

  if (!card || !textEl) return;

  // Fade out
  card.classList.add('fade-out');

  setTimeout(() => {
    textEl.textContent = AFFIRMATIONS[_currentAffIdx];
    if (badge) badge.style.display = _currentAffIdx === todayIdx ? 'inline-flex' : 'none';
    if (counter) counter.textContent = `${_currentAffIdx + 1} / ${AFFIRMATIONS.length}`;

    card.classList.remove('fade-out');
    card.classList.remove('fade-in');
    void card.offsetWidth; // force reflow
    card.classList.add('fade-in');
  }, 180);
}

function renderAffDots() {
  const container = document.getElementById('affDots');
  if (!container) return;
  container.innerHTML = AFFIRMATIONS.map((_, i) =>
    `<div class="aff-dot ${i === _currentAffIdx ? 'active' : ''}"></div>`
  ).join('');
}

/* ── Gratitude ── */
function saveGratitudeEntry() {
  const textarea = document.getElementById('gratitudeInput');
  if (!textarea) return;

  const text = textarea.value.trim();
  if (!text) {
    showToast('🙏 Please write something before saving!');
    return;
  }

  const entries = getGratitudeEntries();
  entries.unshift({
    id:        Date.now(),
    text,
    date: new Date().toISOString(),
  });

  localStorage.setItem(STORAGE_KEY_GRATITUDE, JSON.stringify(entries.slice(0, 30)));
  textarea.value = '';
  renderGratitudeEntries();
  showToast('✨ Gratitude saved! Keep shining 🌟');
}

function getGratitudeEntries() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_GRATITUDE)) || []; }
  catch { return []; }
}

function renderGratitudeEntries() {
  const section   = document.getElementById('gratHistorySection');
  const list      = document.getElementById('gratEntriesList');
  const countEl   = document.getElementById('gratHistoryLabel');
  if (!list) return;

  const entries = getGratitudeEntries();

  if (entries.length === 0) {
    if (section) section.style.display = 'none';
    return;
  }

  if (section) section.style.display = 'block';
  if (countEl) countEl.textContent = `Past Entries (${Math.min(entries.length, 3)})`;

  list.innerHTML = entries.slice(0, 3).map(e => {
    const d = new Date(e.date);
    const dateStr = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const safeText = (() => { const el = document.createElement('div'); el.appendChild(document.createTextNode(e.text)); return el.innerHTML; })();
    return `
      <div class="grat-entry-item" role="listitem">
        <div class="grat-entry-date">✨ ${dateStr} · ${timeStr}</div>
        <div class="grat-entry-text">${safeText}</div>
      </div>`;
  }).join('');
}

/* ── Gratitude history toggle ── */
function initGratitudeToggle() {
  const btn  = document.getElementById('gratHistoryToggle');
  const list = document.getElementById('gratEntriesList');
  if (!btn || !list) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('open');
    list.classList.toggle('visible', isOpen);
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}


/* ══════════════════════════════════════
   INIT
   ══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Breathing page ── */
  if (document.getElementById('breathCircle')) {
    // Render phase guide for default pattern
    renderPhaseSteps();
    updateTip();
    renderSessionHistory();

    // Pattern buttons
    document.querySelectorAll('.pattern-btn').forEach(btn => {
      btn.addEventListener('click', () => selectPattern(btn.dataset.pattern));
    });

    const startBtn = document.getElementById('breathBtn');
    if (startBtn) startBtn.onclick = startBreathing;

    // Ambient sound buttons (Task 6)
    document.querySelectorAll('.sound-btn').forEach(btn => {
      btn.addEventListener('click', () => setAmbientSound(btn.dataset.sound));
    });
    restoreSoundPreference();
  }

  /* ── Chat page ── */
  const chatSend = document.getElementById('chatSendBtn');
  if (chatSend) chatSend.onclick = sendMessage;

  const chatInput = document.getElementById('chatInput');
  if (chatInput) chatInput.addEventListener('keydown', handleChatKey);

  if (document.getElementById('chatMessages')) {
    setTimeout(() => {
      renderMessage("Hey! 👋 I'm Placida, your mental wellness companion. How are you feeling today?", 'bot');
    }, 400);
  }

  /* ── Summary page ── */
  if (document.getElementById('summaryCount')) {
    loadWeeklySummary();
  }

  const saveBtn = document.getElementById('saveJournalBtn');
  if (saveBtn) saveBtn.addEventListener('click', saveJournalEntry);

  /* ── Mindful page (Task 5) ── */
  if (document.getElementById('affirmationCard')) {
    initAffirmationDeck();
    renderGratitudeEntries();
    initGratitudeToggle();

    const saveGratBtn = document.getElementById('saveGratitudeBtn');
    if (saveGratBtn) saveGratBtn.addEventListener('click', saveGratitudeEntry);
  }
});