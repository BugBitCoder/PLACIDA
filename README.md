# 🌿 Placida

**Placida** is a human-centered mental health companion built using **design thinking principles**. It helps users track moods, manage stress, and access emotional support through **journaling**, **guided breathing exercises**, and an **AI chatbot**.

The project was developed using insights gathered from **user personas**, **empathy maps**, and **journey analysis**, making it more than just a static website. Placida is designed to support mental wellness through simple, accessible, and interactive self-care features.

---

## ✨ Overview

Mental health support should feel approachable, safe, and easy to use. Placida aims to create that experience by combining emotional check-ins with lightweight wellness tools in one place.

Users can:

- log their mood daily
- view mood trends and history
- practice guided breathing exercises
- reflect through journaling prompts
- interact with a supportive chatbot

Placida focuses on a calm, simple, and supportive user experience while storing data locally in the browser for quick access and easy testing.

---

## 🎯 Core Features

### 😊 Mood Tracking
Users can log their mood using emoji-based selection on the landing page. These entries are stored in `localStorage` and used across the app to generate insights, history, and real-time dashboard updates.

### 📊 Dashboard v2 (Analytics & Personalization)
The dashboard provides a deep dive into your emotional well-being:
- **Mood Trend Chart**: Visual representation of your mood over the last 7 days using Chart.js.
- **Mood Streak**: A daily counter to encourage consistent self-reflection.
- **Time-aware Greeting**: Personalized greetings that change based on the time of day (Morning/Afternoon/Evening).
- **Safe Reset**: A "Clear All Data" feature to maintain privacy and allow for fresh starts.

### 🌬️ Guided Breathing v2
Customizable stress management tools:
- **Multiple Patterns**: Choose between 4-7-8, Box Breathing, and Simple modes.
- **Dynamic Animations**: Visual cues to guide your inhale, hold, and exhale phases.
- **Session History**: Track your completed cycles to build a mindfulness habit.

### 📝 Weekly Summary & Journaling v2
- **Emoji Retrospective**: A horizontal view of your mood history for the past week.
- **Contextual Journaling**: AI-suggested prompts that adapt based on your average mood.
- **Persistent Journal**: Save and review your reflections with automatic timestamps.

### 💬 AI Chatbot Support v2
A supportive conversational partner with enhanced UX:
- **Contextual Awareness**: Shows a badge with your latest mood to personalize the conversation.
- **Quick-Reply Chips**: Pre-defined buttons for common emotional needs.
- **Persistence**: Your conversation history is saved locally so you never lose track.
- **Support Trigger**: Automatically provides links to professional support resources when needed.

---

## 🚀 Week 2 Enhancements Checklist
- [x] Responsive Mobile Hamburger Navigation
- [x] Character counter for chatbot inputs
- [x] Chart.js integration for visual mood trends
- [x] Alternative breathing pattern selection logic
- [x] Weekly emoji mood row in Summary
- [x] Enhanced `localStorage` data integrity and clearing

---

## 👥 Team Contributions

| Member | Role | Files Owned | Status |
|---|---|---|---|
| **Sahil** | Frontend Dev | `index.html`, `dashboard.html`, `script.js`, `style.css` | ✅ Done |
| **Sanchari** | Frontend Dev | `breathe.html`, `summary.html`, `features.js` | ✅ Done |
| **Ayushi** | UI Dev | `chatbot.html` (Chat UI page) | ✅ Done |
| **Divyans** | QA & Docs | Testing all pages, `README.md` | ✅ Done |

### 😊 Mood Tracking
Users can log their mood using emoji-based selection on the landing page. These entries are stored in `localStorage` and used across the app to generate insights and history.

### 📊 Dashboard Analytics
The dashboard displays mood-related statistics and previously logged entries, allowing users to observe emotional patterns over time.

### 🌬️ Guided Breathing Exercise
Placida includes a **4-7-8 breathing exercise** page with animation and cycle tracking to help users calm themselves during stressful moments.

### 📝 Weekly Summary & Journaling
The summary page provides weekly mood insights, dynamic journaling prompts based on average mood, and a rendered history list for reflection.

### 💬 AI Chatbot Support
The chatbot offers conversational emotional support through the logic implemented in `features.js`. The dedicated chatbot page is designed to connect directly with that engine.

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| **HTML5** | Page structure and semantic layout |
| **CSS3** | Modern styling, glassmorphism UI, and smooth animations |
| **Vanilla JavaScript** | Core application logic, event handling, and state management |
| **Chart.js** | Data visualization for mood trends and analytics |
| **localStorage** | Secure, client-only persistence for moods, chat, and journaling |

### Notes
- No frameworks are used
- No build tools are required
- No backend setup is needed for local execution

You can run the project by simply opening `index.html` in your browser.

---

## 📁 Project Structure

```text
PLACIDA/
│
├── index.html         # Landing page + mood logger
├── dashboard.html     # Mood statistics and history
├── breathe.html       # Guided breathing exercise
├── summary.html       # Weekly summary + journal prompts
├── chatbot.html       # Chatbot user interface
├── script.js          # Mood logging and localStorage logic
├── features.js        # Breathing timer, chatbot engine, weekly stats logic
├── style.css          # Shared styling across pages
└── README.md          # Project documentation