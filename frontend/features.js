/* ============================================
   PLACIDA — features.js
   Week 1 Features Logic — Sanchari
   Breathing Timer | Chatbot | Weekly Summary
   ============================================ */

/* ══════════════════════════════════════
   SECTION 1 — BREATHING TIMER (4-7-8)
   ══════════════════════════════════════ */

const BREATH_PHASES = [
  { label: 'Inhale',  emoji: '🌬️', duration: 4, color: '#7c6af7' },
  { label: 'Hold',    emoji: '🤚', duration: 7, color: '#5ec4b6' },
  { label: 'Exhale',  emoji: '💨', duration: 8, color: '#f06b8b' },
];

let breathInterval  = null;
let breathPhaseIdx  = 0;
let breathCountdown = BREATH_PHASES[0].duration;
let breathCycles    = 0;
let breathRunning   = false;

function startBreathing() {
  if (breathRunning) return;
  breathRunning   = true;
  breathPhaseIdx  = 0;
  breathCountdown = BREATH_PHASES[0].duration;
  breathCycles    = 0;

  updateBreathUI();
  setBreathStart();

  const btn = document.getElementById('breathBtn');
  if (btn) { btn.textContent = 'Stop Session'; btn.onclick = stopBreathing; }
}

function stopBreathing() {
  clearInterval(breathInterval);
  breathRunning = false;
  breathPhaseIdx  = 0;
  breathCountdown = BREATH_PHASES[0].duration;

  const label   = document.getElementById('breathLabel');
  const counter = document.getElementById('breathCounter');
  const circle  = document.getElementById('breathCircle');
  const cycles  = document.getElementById('breathCycles');
  const btn     = document.getElementById('breathBtn');

  if (label)   label.textContent   = 'Ready when you are';
  if (counter) counter.textContent = '';
  if (circle)  { circle.style.transform = 'scale(1)'; circle.style.boxShadow = '0 0 60px rgba(124,106,247,0.3)'; }
  if (cycles)  cycles.textContent  = '0 cycles completed';
  if (btn)     { btn.textContent = 'Start Breathing'; btn.onclick = startBreathing; }
}

function setBreathStart() {
  breathInterval = setInterval(() => {
    breathCountdown--;
    updateBreathUI();

    if (breathCountdown <= 0) {
      breathPhaseIdx = (breathPhaseIdx + 1) % BREATH_PHASES.length;
      if (breathPhaseIdx === 0) breathCycles++;
      breathCountdown = BREATH_PHASES[breathPhaseIdx].duration;
    }
  }, 1000);
}

function updateBreathUI() {
  const phase   = BREATH_PHASES[breathPhaseIdx];
  const label   = document.getElementById('breathLabel');
  const counter = document.getElementById('breathCounter');
  const circle  = document.getElementById('breathCircle');
  const cycles  = document.getElementById('breathCycles');
  const phaseEl = document.getElementById('breathPhase');

  if (label)   label.textContent   = `${phase.emoji}  ${phase.label}`;
  if (counter) counter.textContent = breathCountdown + 's';
  if (cycles)  cycles.textContent  = `${breathCycles} cycle${breathCycles !== 1 ? 's' : ''} completed`;
  if (phaseEl) phaseEl.textContent = `Phase ${breathPhaseIdx + 1}/3`;

  if (circle) {
    if (phase.label === 'Inhale') {
      circle.style.transform  = 'scale(1.35)';
      circle.style.boxShadow  = `0 0 80px rgba(124,106,247,0.55)`;
    } else if (phase.label === 'Hold') {
      circle.style.transform  = 'scale(1.35)';
      circle.style.boxShadow  = `0 0 80px rgba(94,196,182,0.55)`;
    } else {
      circle.style.transform  = 'scale(0.85)';
      circle.style.boxShadow  = `0 0 60px rgba(240,107,139,0.45)`;
    }
    circle.style.borderColor = phase.color;
  }
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


/* ══════════════════════════════════════
   SECTION 3 — WEEKLY SUMMARY
   ══════════════════════════════════════ */

const STORAGE_KEY_MOODS = 'placida_moods';

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

  // Streak — consecutive days logged
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


/* ══════════════════════════════════════
   INIT
   ══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Breathing page
  const startBtn = document.getElementById('breathBtn');
  if (startBtn) startBtn.onclick = startBreathing;

  // Chat page
  const chatSend = document.getElementById('chatSendBtn');
  if (chatSend) chatSend.onclick = sendMessage;

  const chatInput = document.getElementById('chatInput');
  if (chatInput) chatInput.addEventListener('keydown', handleChatKey);

  // Chat welcome message
  if (document.getElementById('chatMessages')) {
    setTimeout(() => {
      renderMessage("Hey! 👋 I'm Placida, your mental wellness companion. How are you feeling today?", 'bot');
    }, 400);
  }

  // Summary page
  if (document.getElementById('summaryCount')) {
    loadWeeklySummary();
  }
});