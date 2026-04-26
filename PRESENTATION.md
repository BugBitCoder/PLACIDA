# 🎤 Placida — Final Presentation Script

This script outlines the flow for the 10-minute final presentation of Placida.

## 🕒 Timing Overview
- **0:00 - 1:00**: Introduction (Sahil)
- **1:00 - 2:00**: Design Process (Team)
- **2:00 - 7:00**: Live Demo (Divided)
- **7:00 - 8:00**: Tech Stack (Sahil)
- **8:00 - 9:00**: Feedback Results (Divyans)
- **9:00 - 10:00**: Future Scope & Wrap-up (Team)

---

## 🏗️ Introduction (Sahil — 1 min)
- **The Problem**: Mental wellness is often overlooked. Existing apps are either too complex, require expensive subscriptions, or compromise user privacy by sending sensitive emotional data to servers.
- **The Solution**: **Placida** — a human-centered, private, and offline-first wellness companion. It’s designed to be simple, accessible, and completely local to the user's browser.

## 🎨 Design Process (All — 1 min)
- **Methodology**: We followed **Design Thinking** principles.
- **Tools**: Created user personas to understand diverse mental health needs, empathy maps to visualize user feelings, and journey analysis to identify pain points in typical self-care routines.
- **Result**: A calm, dark glassmorphism interface that reduces cognitive load.

## 💻 Live Demo (5 min)

### 📈 Part 1: Awareness (Sahil)
- **Landing Page**: Demonstrate the emoji-based mood logger. Show how a single click saves the entry.
- **Dashboard**: Show the **Mood Trend Chart** (Chart.js) and the **Streak Counter**. Mention the **Time-aware Greeting** that personalizes the experience.

### 💬 Part 2: Support (Ayushi)
- **Chatbot Interface**: Show the quick-reply chips and character counter.
- **Contextual Support**: Point out the **Mood Context Badge** and show how the bot remembers previous interactions through localStorage persistence.
- **Resources**: Show the support section that appears when the user needs professional help.

### 🌬️ Part 3: Action & Reflection (Sanchari)
- **Guided Breathing**: Demo the 4-7-8 and Box Breathing patterns with animations. Show the session history counter.
- **Weekly Summary**: Show the 7-day emoji row and the adaptive journaling prompts.
- **Journaling**: Write a quick reflection and show it being saved with a timestamp.

## ⚙️ Tech Stack (Sahil — 1 min)
- **Core**: HTML5, CSS3 (Glassmorphism), Vanilla JavaScript.
- **Storage**: `localStorage` (No backend required for privacy).
- **Visualization**: Chart.js v4.4.0.
- **PWA Ready**: Web App Manifest and Service Worker for offline capability.

## 📊 Feedback Results (Divyans — 1 min)
- *[Placeholder for Week 4 User Testing results]*
- Initial feedback highlights: Users loved the "no-login" approach and the calm aesthetic. Discussion on ease of navigation vs. feature discoverability.

## 🔮 Future Scope (All — 1 min)
- **Connectivity**: Optional backend integration (Node.js + MongoDB) for cross-device sync.
- **Human Touch**: Real-time therapist matching system.
- **Native Experience**: Porting to iOS/Android using **Capacitor**.
- **Enhanced AI**: Integrating lightweight LLMs for more nuanced emotional support.
