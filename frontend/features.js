/* ============================================
   PLACIDA — features.js
   Week 1 Features Logic — Sanchari
   Breathing Timer | Chatbot | Weekly Summary
   ============================================ */

/* ══════════════════════════════════════
   SECTION 1 — BREATHING TIMER (4-7-8)
   ══════════════════════════════════════ */

const BREATH_PHASES = [
  { label: 'Inhale', emoji: '🌬️', duration: 4, color: '#7c6af7' },
  { label: 'Hold', emoji: '🤚', duration: 7, color: '#5ec4b6' },
  { label: 'Exhale', emoji: '💨', duration: 8, color: '#f06b8b' },
];

let breathInterval = null;
let breathPhaseIdx = 0;
let breathCountdown = BREATH_PHASES[0].duration;
let breathCycles = 0;
let breathRunning = false;

function toggleBreathing() {
  if (breathRunning) stopBreathing();
  else startBreathing();
}

function startBreathing() {
  if (breathRunning) return;
  breathRunning = true;
  breathPhaseIdx = 0;
  breathCountdown = BREATH_PHASES[0].duration;
  breathCycles = 0;

  updateBreathUI();
  setBreathStart();

  const label = document.getElementById('breathLabel');
  if (label) label.textContent = 'Tap to Stop';
}

function stopBreathing() {
  clearInterval(breathInterval);
  breathRunning = false;
  breathPhaseIdx = 0;
  breathCountdown = BREATH_PHASES[0].duration;

  const label = document.getElementById('breathLabel');
  const counter = document.getElementById('breathCounter');
  const circle = document.getElementById('breathCircle');
  const cycles = document.getElementById('breathCycles');

  if (label) label.textContent = 'Tap to Start';
  if (counter) counter.textContent = '';
  if (circle) { circle.style.transform = 'scale(1)'; circle.style.boxShadow = '0 0 60px rgba(124,106,247,0.3)'; }
  if (cycles) cycles.textContent = '0 cycles completed';
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
  const phase = BREATH_PHASES[breathPhaseIdx];
  const label = document.getElementById('breathLabel');
  const counter = document.getElementById('breathCounter');
  const circle = document.getElementById('breathCircle');
  const cycles = document.getElementById('breathCycles');
  const phaseEl = document.getElementById('breathPhase');

  if (label) label.textContent = `${phase.emoji}  ${phase.label}`;
  if (counter) counter.textContent = breathCountdown + 's';
  if (cycles) cycles.textContent = `${breathCycles} cycle${breathCycles !== 1 ? 's' : ''} completed`;
  if (phaseEl) phaseEl.textContent = `Phase ${breathPhaseIdx + 1}/3`;

  if (circle) {
    if (phase.label === 'Inhale') {
      circle.style.transform = 'scale(1.35)';
      circle.style.boxShadow = `0 0 80px rgba(124,106,247,0.55)`;
    } else if (phase.label === 'Hold') {
      circle.style.transform = 'scale(1.35)';
      circle.style.boxShadow = `0 0 80px rgba(94,196,182,0.55)`;
    } else {
      circle.style.transform = 'scale(0.85)';
      circle.style.boxShadow = `0 0 60px rgba(240,107,139,0.45)`;
    }
    circle.style.borderColor = phase.color;
  }
}


/* ══════════════════════════════════════
   SECTION 2 — CHATBOT (Pollinations AI + rule fallback)
   ══════════════════════════════════════ */

const AI_SYSTEM = `You are Placida, a warm, compassionate, emotionally intelligent AI mental wellness companion for students and young adults.

Your CORE PURPOSE is to make people feel genuinely heard, validated, and less alone — especially when they are struggling.

MULTILINGUAL SUPPORT:
You are fully multilingual. You MUST automatically detect the language of the user's input and reply fluently in that EXACT same language. Ensure your empathy, warmth, and personality translate appropriately into their language.

KEY GUIDELINES:
1. ALWAYS start by acknowledging the user's emotion before anything else. Never jump to advice, tips, or suggestions without first validating how they feel.
2. When someone shares pain (depression, sadness, anxiety, loneliness), respond with empathy FIRST. Say things like "That sounds really heavy" or "I hear you — that's so hard" before anything else.
3. Keep replies SHORT — 2 to 4 sentences maximum. Never overwhelm with a wall of text.
4. Write like a caring, wise friend — NOT like a therapist or life coach. No jargon, no lists, no bullet points.
5. NEVER give generic advice like "cherish life" or "stay positive" or "things will get better" — these feel dismissive and hollow. Be specific and real.
6. Do NOT diagnose. Do NOT prescribe. You are a companion, not a clinician.
7. If someone mentions self-harm, suicidal thoughts, or wanting to die — respond with immediate care and share: iCall: 9152987821 (free, confidential, Mon-Sat 8am-10pm). Do not redirect to features.
8. Use at most 1-2 emojis per reply. Prefer none if the topic is serious.
9. Vary your phrasing every time — never repeat the same opening phrase twice in a conversation.
10. Ask ONE caring follow-up question when appropriate — don't interrogate.
11. Only mention Placida features (breathing, journaling, relax games) AFTER validating the emotion, and only if it genuinely fits.
12. Match your tone to the user's energy. If they are dark and heavy, don't be perky. If they are light, you can be warmer.

EXAMPLES OF BAD REPLIES (NEVER say these):
- "Life is beautiful, cherish it!"
- "Stay positive!"
- "Things will get better!"
- "You should try meditating."
- Generic greetings that don't match what the user said.

EXAMPLES OF GOOD REPLIES:
- "That sounds really heavy. You don't have to carry this alone — what's been weighing on you most?"
- "I hear you. Feeling that low is exhausting. Can you tell me a little more about what's been going on?"
- "Depression is real and it's hard. I'm glad you're talking about it. What does a typical day feel like for you right now?"

Context: This app is used by students during stressful times. Many users are 16-25 years old. Treat them with full respect and seriousness.`;

/* — No-repeat tracker — */
const recentBotReplies = [];
function trackReply(text) {
  recentBotReplies.push(text);
  if (recentBotReplies.length > 5) recentBotReplies.shift();
}
function pickUnique(arr) {
  const fresh = arr.filter(r => !recentBotReplies.includes(r));
  const pool = fresh.length ? fresh : arr;
  return pool[Math.floor(Math.random() * pool.length)];
}

/* — Conversation history for context — */
const chatHistory = [];

/* — AI API call (Pollinations AI - Free, No Key Required) — */
async function getPollinationsResponse(userMessage) {
  try {
    const messages = [
      { role: 'system', content: AI_SYSTEM },
      ...chatHistory.slice(-6).map(m => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.content
      })),
      { role: 'user', content: userMessage }
    ];
    
    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model: 'openai', 
        seed: Math.floor(Math.random() * 100000)
      })
    });
    
    if (!res.ok) return null;
    const text = await res.text();
    return text || null;
  } catch (err) {
    console.error("AI API Error:", err);
    return null;
  }
}

/* — Rich rule-based fallback — */
const BOT_RULES = [
  {
    keys: ['hi', 'hello', 'hey', 'hii', 'helo', 'howdy', 'good morning', 'good evening', 'sup', 'yo'],
    replies: [
      "Hey 👋 I'm glad you're here. How are you feeling right now?",
      "Hello! This is your safe space — what's on your mind today?",
      "Hi! Hope you're hanging in there. What's been going on for you?",
      "Hey, good to see you here. How are things feeling today?"
    ]
  },
  {
    keys: ['depressed', 'depression', 'feel nothing', 'numb', 'pointless', 'worthless', 'no point', 'what\'s the point', 'no reason', 'can\'t feel anything', 'dead inside', 'feel dead'],
    replies: [
      "I hear you — feeling that empty or low is genuinely hard. You don't have to pretend to be okay here. What's been going on for you lately?",
      "Depression is real, and what you're feeling matters. I'm here — can you tell me a little more about what's been weighing on you?",
      "That sounds really heavy to carry. You reached out, and that takes courage. What does a typical day feel like for you right now?",
      "Feeling this way is exhausting, and I want you to know I'm taking what you're saying seriously. What's been the hardest part lately?"
    ]
  },
  {
    keys: ['anxious', 'anxiety', 'panic', 'panic attack', 'nervous', 'worry', 'worried', 'overthinking', 'dread', 'can\'t stop thinking'],
    replies: [
      "Anxiety can feel like your mind won't give you a break. What's been triggering it most right now?",
      "That unsettled, spiralling feeling is so draining. What's the main thing your mind keeps circling back to?",
      "I hear you — anxiety makes everything feel bigger and harder. Take one slow breath first. What's going on?",
      "Overthinking is exhausting. You don't have to solve it all right now. What's weighing on you most?"
    ]
  },
  {
    keys: ['sad', 'unhappy', 'down', 'low', 'crying', 'tears', 'hopeless', 'heartbroken', 'empty', 'broken', 'feel bad', 'feeling bad'],
    replies: [
      "I'm really sorry you're feeling this way. You don't have to go through it alone — what's been happening?",
      "Feeling that low is hard, and it makes sense you need somewhere to let it out. What's weighing on you?",
      "Sending you warmth right now. What happened — or has it been building for a while?",
      "That's a hard place to be in. I'm here and I'm listening — tell me what's going on."
    ]
  },
  {
    keys: ['happy', 'great', 'amazing', 'wonderful', 'fantastic', 'excited', 'joy', 'blessed', 'content', 'good mood'],
    replies: [
      "That's genuinely good to hear 🌟 What made today feel this way?",
      "Love that! Those moments are worth holding onto. What's been making things feel good?",
      "Really glad you're feeling that way — what sparked it?",
      "That's the vibe 😊 Celebrate that for a second — what's going well?"
    ]
  },
  {
    keys: ['stressed', 'stress', 'overwhelmed', 'pressure', 'burnout', 'too much', 'can\'t cope', 'can\'t handle'],
    replies: [
      "Feeling overwhelmed is your mind telling you it's carrying a lot. What's piling up most right now?",
      "You don't have to tackle everything at once. What's the biggest thing that's draining you?",
      "That's a lot to be dealing with. What would feel like a relief right now, even a small one?",
      "Burnout creeps up quietly. How long has it been feeling this heavy?"
    ]
  },
  {
    keys: ['tired', 'exhausted', 'drained', 'fatigue', 'sleepy', 'no energy', 'burnt out', 'burned out', 'so tired'],
    replies: [
      "Rest is not a luxury — it's necessary. What's been taking the most out of you lately?",
      "Feeling that drained often means you've been giving a lot without enough to refill. What does rest look like for you?",
      "That kind of exhaustion is real. Have you had any space to breathe and slow down?",
      "Your body is telling you something important. What's been keeping you running on empty?"
    ]
  },
  {
    keys: ['angry', 'anger', 'mad', 'furious', 'frustrated', 'irritated', 'annoyed', 'rage', 'pissed', 'so angry'],
    replies: [
      "Anger is a valid feeling — let it out here. What happened?",
      "Frustration often means something that matters to you was crossed. What's behind it?",
      "That sounds really frustrating. Tell me what's going on — I'm listening.",
      "Anger sometimes hides something deeper — hurt, or feeling unheard. What's really going on?"
    ]
  },
  {
    keys: ['lonely', 'alone', 'isolated', 'no one', 'nobody', 'no friends', 'no one cares', 'left out', 'feel invisible'],
    replies: [
      "Loneliness is one of the heaviest feelings. I'm here — you're not as alone as it might feel right now.",
      "You reached out, and that took something. What's making you feel this disconnected?",
      "Feeling invisible or left out really hurts. Tell me what's been going on.",
      "I hear you. That kind of loneliness is real. What does your day-to-day look like right now?"
    ]
  },
  {
    keys: ['help', 'need help', 'support', 'talk to someone', 'need someone', 'please help'],
    replies: [
      "I'm right here and I'm listening. What do you need right now?",
      "You don't have to face this alone. Take your time — tell me what's going on.",
      "Of course. Start wherever feels easiest — I've got time for you."
    ]
  },
  {
    keys: ['breathe', 'breathing', 'breath', 'calm down', 'calm me', 'help me calm'],
    replies: [
      "Let's slow down together. Try this: breathe in for 4 seconds, hold for 4, and out for 4. Or head to the Breathe page (press B) for a full guided session.",
      "Even one slow breath changes your body's response. Close your eyes for a second and breathe with me. In... hold... and out. Better?",
      "Guided breathing works really well. Press B to open the breathing guide — it'll walk you through it step by step."
    ]
  },
  {
    keys: ['journal', 'write', 'diary', 'express', 'reflect', 'thoughts', 'note'],
    replies: [
      "Writing is one of the most powerful ways to process what you're feeling. Head to the Summary page (press S) to start.",
      "Getting it out of your head and into words really helps. The journal on the Summary page is private — just for you.",
      "Journaling can turn confusion into clarity. Press S to open your private journal whenever you're ready."
    ]
  },
  {
    keys: ['harm', 'hurt myself', 'end it', 'give up', 'kill', 'suicide', 'suicidal', 'self harm', 'want to die', 'don\'t want to live', 'not worth living'],
    replies: [
      "🚨 I'm really concerned about you right now, and I want you to know that what you're feeling matters. Please reach out to iCall: 9152987821 — they're free, confidential, and available Mon-Sat, 8am-10pm. You don't have to go through this alone.",
      "Please don't go through this alone. Vandrevala Foundation is available 24/7: 1860-2662-345. They are confidential and here for exactly this. You matter — please call them."
    ]
  },
  {
    keys: ['thank', 'thanks', 'thank you', 'thankyou', 'appreciate', 'that helped'],
    replies: [
      "Always here for you 💜 Take care of yourself today.",
      "Of course! You deserve support too 🌿",
      "That means a lot. Remember — checking in with yourself is always worth it."
    ]
  },
];

const DEFAULT_REPLIES = [
  "I’m here and listening 💙 Tell me more.",
  "Thanks for sharing that. How does it make you feel?",
  "I want to understand better — can you tell me more about that?",
  "That sounds like a lot to carry. I’m with you.",
  "I hear you. What would feel most helpful right now?",
  "You’re doing the right thing by talking it out. What else is on your mind?"
];

function getRuleBasedReply(message) {
  const lower = message.toLowerCase();
  for (const rule of BOT_RULES) {
    if (rule.keys.some(k => lower.includes(k))) {
      return pickUnique(rule.replies);
    }
  }
  return pickUnique(DEFAULT_REPLIES);
}

function renderMessage(text, sender) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  const wrapper = document.createElement('div');
  wrapper.className = `chat-msg ${sender}`;
  wrapper.style.animation = 'fadeInUp 0.3s ease both';
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

async function sendMessage() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  renderMessage(text, 'user');
  chatHistory.push({ role: 'user', content: text });
  input.value = '';
  showTypingIndicator();
  
  // Adaptive Sidebar Update
  analyzeChatMood(text);

  /* Try AI first, then fall back to rules */
  let reply = await getPollinationsResponse(text);
  
  if (!reply) {
    reply = getRuleBasedReply(text);
  }

  /* Proportional delay: feels natural without being slow */
  const delay = Math.min(reply.length * 14, 2400);
  setTimeout(() => {
    removeTypingIndicator();
    renderMessage(reply, 'bot');
    chatHistory.push({ role: 'bot', content: reply });
    trackReply(reply);
  }, delay);
}

function analyzeChatMood(text) {
  const lower = text.toLowerCase();
  const indicator = document.getElementById('chatMoodIndicator');
  const suggestions = document.getElementById('chatAdaptiveSuggestions');
  if (!indicator || !suggestions) return;

  if (lower.includes('anxious') || lower.includes('panic') || lower.includes('overwhelmed') || lower.includes('stress')) {
    indicator.innerHTML = '😟 Anxious / Stressed';
    suggestions.innerHTML = `
      <a href="breathe.html" class="action-card" style="text-decoration:none">
        <div class="action-icon">🌬️</div>
        <div class="action-title">4-7-8 Breathing</div>
        <div class="action-desc">Calm your nervous system</div>
      </a>
      <a href="relax.html" class="action-card" style="text-decoration:none">
        <div class="action-icon">🎮</div>
        <div class="action-title">Worry Crusher</div>
        <div class="action-desc">Destroy anxious thoughts</div>
      </a>
    `;
  } else if (lower.includes('sad') || lower.includes('depressed') || lower.includes('cry') || lower.includes('lonely') || lower.includes('hopeless')) {
    indicator.innerHTML = '😔 Feeling Low';
    suggestions.innerHTML = `
      <a href="journal.html" class="action-card" style="text-decoration:none">
        <div class="action-icon">📓</div>
        <div class="action-title">Guided Journal</div>
        <div class="action-desc">Reflect on these feelings</div>
      </a>
      <a href="community.html" class="action-card" style="text-decoration:none">
        <div class="action-icon">🌍</div>
        <div class="action-title">Community Wall</div>
        <div class="action-desc">Read anonymous affirmations</div>
      </a>
    `;
  } else if (lower.includes('happy') || lower.includes('good') || lower.includes('great') || lower.includes('joy')) {
    indicator.innerHTML = '😊 Positive / Good';
    suggestions.innerHTML = `
      <a href="journal.html" class="action-card" style="text-decoration:none">
        <div class="action-icon">🌟</div>
        <div class="action-title">Gratitude Journal</div>
        <div class="action-desc">Log this positive moment</div>
      </a>
      <a href="insights.html" class="action-card" style="text-decoration:none">
        <div class="action-icon">📊</div>
        <div class="action-title">View Insights</div>
        <div class="action-desc">See your upward trend</div>
      </a>
    `;
  } else if (lower.includes('help') || lower.includes('die') || lower.includes('kill') || lower.includes('end it')) {
    indicator.innerHTML = '🆘 Crisis Detected';
    indicator.style.color = '#f06b8b';
    suggestions.innerHTML = `
      <div style="background:rgba(240,107,139,.1); border:1px solid rgba(240,107,139,.3); padding:14px; border-radius:12px; margin-bottom:10px;">
        <div style="font-weight:700; color:#f06b8b; margin-bottom:6px;">We are here for you.</div>
        <div style="font-size:0.85rem; color:var(--text-primary); margin-bottom:12px;">Please reach out to a professional who can help right now.</div>
        <button onclick="document.querySelector('.sos-float-btn')?.click()" style="width:100%; padding:8px; border-radius:8px; background:#f06b8b; color:#fff; border:none; cursor:pointer; font-weight:600;">View Helplines</button>
      </div>
    `;
  } else {
    indicator.innerHTML = '😐 Neutral / Reflective';
    indicator.style.color = 'var(--text-primary)';
    suggestions.innerHTML = `
      <a href="meditation.html" class="action-card" style="text-decoration:none">
        <div class="action-icon">🧘</div>
        <div class="action-title">Mindfulness</div>
        <div class="action-desc">A quick grounding session</div>
      </a>
    `;
  }
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
    setEl('summaryAvg', '—');
    setEl('summaryTop', '—');
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

  setEl('summaryCount', moods.length.toString());
  setEl('summaryAvg', avg.toFixed(1));
  setEl('summaryTop', topEmoji);
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
    // BUG-003: escape note to prevent XSS before injecting into innerHTML
    const safeNote = entry.note ? escapeHtmlChat(String(entry.note)) : '';
    return `
      <div class="mood-entry">
        <div class="entry-emoji">${entry.emoji}</div>
        <div class="entry-info">
          <div class="entry-mood">${entry.label}</div>
          ${safeNote ? `<div class="entry-note">${safeNote}</div>` : ''}
        </div>
        <div class="entry-time">${dayLabel}</div>
      </div>`;
  }).join('');
}



/* ══════════════════════════════════════
   INIT
   ══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Breathing page is now handled by inline onclick in breathe.html (toggleBreathing)

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

  // Week 3: Keyboard shortcuts (all pages loading features.js)
  (function initKeyboardShortcuts() {
    document.addEventListener('keydown', e => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const map = {
        m: 'index.html', b: 'breathe.html', c: 'chatbot.html',
        d: 'dashboard.html', i: 'insights.html', s: 'summary.html',
      };
      if (map[e.key.toLowerCase()]) window.location.href = map[e.key.toLowerCase()];
    });
    const hint = document.getElementById('shortcutHint');
    const panel = document.getElementById('shortcutPanel');
    if (hint && panel) {
      hint.addEventListener('click', () => {
        const visible = panel.style.display === 'block';
        panel.style.display = visible ? 'none' : 'block';
        panel.setAttribute('aria-hidden', String(visible));
      });
      document.addEventListener('click', e => {
        if (!hint.contains(e.target) && !panel.contains(e.target)) {
          panel.style.display = 'none';
          panel.setAttribute('aria-hidden', 'true');
        }
      });
    }
  })();
});

/* ════════════════════════════════════════
   VOICE INPUT — Web Speech API
════════════════════════════════════════ */
window._isRecording = false;
let _recognition = null;

function toggleVoiceInput() {
  const btn = document.getElementById('voiceMicBtn');
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (typeof showToast === 'function') showToast('🎤 Voice input not supported in this browser. Try Chrome.');
    return;
  }

  if (window._isRecording) {
    if (_recognition) _recognition.stop();
    return;
  }

  _recognition = new SpeechRecognition();
  _recognition.lang = 'en-IN';
  _recognition.interimResults = true;
  _recognition.maxAlternatives = 1;
  _recognition.continuous = false;

  _recognition.onstart = () => {
    window._isRecording = true;
    if (btn) {
      btn.textContent = '🔴';
      btn.style.background = 'rgba(240,107,139,.25)';
      btn.style.borderColor = 'rgba(240,107,139,.5)';
      btn.style.animation = 'pulse 1.5s ease infinite';
    }
    const input = document.getElementById('chatInput');
    if (input) input.placeholder = 'Listening… speak now';
  };

  _recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    const input = document.getElementById('chatInput');
    if (input) input.value = transcript;
  };

  _recognition.onend = () => {
    window._isRecording = false;
    if (btn) {
      btn.textContent = '🎤';
      btn.style.background = 'rgba(255,255,255,.06)';
      btn.style.borderColor = 'var(--border-glass)';
      btn.style.animation = '';
    }
    const input = document.getElementById('chatInput');
    if (input) {
      input.placeholder = 'How are you feeling today… or tap 🎤 to speak';
      const text = input.value.trim();
      if (text.length > 2) {
        setTimeout(() => {
          const sendBtn = document.getElementById('chatSendBtn');
          if (sendBtn) sendBtn.click();
        }, 400);
      }
    }
  };

  _recognition.onerror = (event) => {
    window._isRecording = false;
    if (btn) { btn.textContent = '🎤'; btn.style.background = ''; btn.style.borderColor = ''; btn.style.animation = ''; }
    if (event.error === 'not-allowed') {
      if (typeof showToast === 'function') showToast('⚠️ Please allow microphone access in browser settings');
    } else if (event.error !== 'no-speech') {
      if (typeof showToast === 'function') showToast('🎤 Could not hear you — please try again');
    }
  };

  _recognition.start();
}

