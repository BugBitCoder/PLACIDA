# PLACIDA 🌿

Placida is a **human-centered mental health companion** built using design thinking principles. It enables users to track moods, manage stress, and access support through journaling, guided breathing exercises, and an AI chatbot. Developed using insights from user personas, empathy maps, and journey analysis.

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Page structure and layout |
| CSS3 | Styling and animations |
| Vanilla JavaScript | App logic and interactivity |
| localStorage | Client-side data persistence (moods, journal entries) |

> No frameworks or build tools required. Just open `index.html` in your browser.

---

## 📁 Pages & Their Purpose

| Page | File | Description |
|---|---|---|
| Landing / Mood Logger | `index.html` | Main entry point; users log their daily mood via emoji selection |
| Dashboard | `dashboard.html` | Visual stats and mood history pulled from localStorage |
| Breathing Exercise | `breathe.html` | Guided 4-7-8 breathing with animated circle and cycle counter |
| Weekly Summary | `summary.html` | Weekly mood stats, journal prompts based on avg mood, history list |
| Chatbot | `chatbot.html` | Conversational support chatbot powered by `features.js` engine |

---

## 🚀 How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/BugBitCoder/PLACIDA.git
   cd PLACIDA
   ```
2. Open `index.html` directly in any modern browser — no server needed.

---

## 👥 Team — Week 1 Contributions

| Member | Role | Files Owned | Status |
|---|---|---|---|
| **Sahil** | Frontend Dev | `index.html`, `dashboard.html`, `script.js`, `style.css` | ✅ Done |
| **Sanchari** | Frontend Dev | `breathe.html`, `summary.html`, `features.js` | ✅ Done |
| **Ayushi** | UI Dev | `chatbot.html` (Chat UI page) | ✅ Done |
| **Divyans** | QA & Docs | Testing all pages, `README.md` | ✅ Done |

---

## 🧪 Week 1 — Testing Checklist (Divyans)

### Page-level Tests
- [ ] `index.html` → Emoji mood selection, mood save, toast notification, localStorage entry created
- [ ] `dashboard.html` → Stat cards update correctly, mood history renders entries
- [ ] `breathe.html` → Start/Stop button works, circle animates through phases, cycle counter increments
- [ ] `summary.html` → Stats populate correctly, journal prompt changes based on avg mood, history list renders
- [ ] `chatbot.html` → Bot replies correctly, typing indicator shows, Enter key sends message

### Cross-Page Checks
- [ ] All navbar links navigate correctly across all 5 pages
- [ ] localStorage data persists and is correctly read across pages

### Responsive Check
- [ ] Narrow browser window (mobile simulation) for all 5 pages

---

## 💬 Chatbot Integration Notes (for Ayushi)

The chatbot engine is fully written in `features.js`. The `chatbot.html` page **must** use these exact IDs (already wired in `features.js`):

| Element | Required ID |
|---|---|
| Chat messages container | `chatMessages` |
| User text input | `chatInput` |
| Send button | `chatSendBtn` |

CSS classes expected by `features.js`:
- `.chat-msg.user` and `.chat-msg.bot` — chat bubble wrappers
- `.bubble` — the message bubble itself
- `.msg-time` — timestamp inside each bubble
- `.typing-indicator` — animated 3-dot typing indicator

---

## 🗺️ Week 1 — Full Ownership Summary

| File | Owner | Status |
|---|---|---|
| `index.html` | Sahil | ✅ Done |
| `dashboard.html` | Sahil | ✅ Done |
| `script.js` | Sahil | ✅ Done |
| `style.css` | Sahil | ✅ Done |
| `breathe.html` | Sanchari | ✅ Done |
| `summary.html` | Sanchari | ✅ Done |
| `features.js` | Sanchari | ✅ Done |
| `chatbot.html` | Ayushi | ⏳ Pending |
| Testing + `README.md` | Divyans | ⏳ In Progress |

---

## 📌 Design Thinking Approach

Placida was built using a structured design thinking methodology:
- **Empathize** — User interviews, empathy maps to understand mental health struggles
- **Define** — Problem statements and user personas
- **Ideate** — Feature brainstorming (mood tracking, journaling, breathing, chatbot)
- **Prototype** — HTML/CSS/JS pages (current stage)
- **Test** — Cross-browser and usability testing (Week 1 QA)

---

## 🆘 Crisis Resources

If you or someone you know is in distress:
- **iCall**: 9152987821
- **Vandrevala Foundation**: 1860-2662-345 (24/7)

---

*© 2026 Placida — Built with 💚 for mental wellness*
