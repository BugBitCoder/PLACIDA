# ⏭️ PLACIDA — Next Actions

> **CRITICAL FILE — Always update this before stopping work.**  
> A future agent or team member must be able to resume work solely from this file.

---

## 🕐 Last Updated
**2026-05-31 12:26 IST** — Progress Persistence System initialized by Antigravity agent.

---

## 📍 Current Task
Setting up the `project-progress/` persistence system to survive context resets and allow resumption by any agent or team member.

**Status:** ✅ COMPLETE — All 5 tracking files created.

---

## 📋 Remaining Tasks (Priority Order)

### 🔴 HIGH PRIORITY

1. **Fix BUG-011 — Chatbot Crisis Detection**  
   - File: `features.js` → `BOT_RULES` object  
   - Action: Add more crisis keywords (e.g., "I want to die", "hurt myself", "hopeless")  
   - Action: After 3+ crisis-keyword messages, trigger helpline modal  
   - Assigned: Ayushi (`backend-ayushi` branch)

2. **Fix BUG-003 — XSS in Weekly Summary**  
   - File: `features.js` → `renderWeeklyHistory()`  
   - Action: Replace `innerHTML` injection with `textContent` or escape function  
   - Validation: Inject `<script>alert(1)</script>` as note → must not execute

### 🟡 MEDIUM PRIORITY

3. **Fix BUG-012 — "Most-Used Feature" on Dashboard**  
   - File: `script.js` + `dashboard.html`  
   - Action: Add per-feature usage counters to localStorage  
   - Action: Display on Dashboard stats section  
   - Assigned: Sanchari (`features-sanchari` branch)

4. **Fix BUG-013 — Mobile Responsiveness**  
   - File: `style.css`  
   - Action: Add `@media (max-width: 380px)` breakpoints  
   - Test on: iPhone SE (375px), Galaxy A03 (320px)  
   - Assigned: Sahil (`frontend-sahil` branch)

5. **Fix BUG-001 — Summary Nav Active State**  
   - File: `summary.html`  
   - Action: Update nav active class from `chat` link to `summary` link

6. **Fix BUG-002 — Toast Z-Index**  
   - File: `style.css`  
   - Action: Increase toast z-index above modal overlay

7. **Fix BUG-004 — Dynamic Stats Card Colors**  
   - File: `script.js` + `style.css`  
   - Action: Add conditional color classes based on mood score

8. **Fix BUG-006 — Negative Time Ago**  
   - File: `script.js`  
   - Action: Add `Math.max(0, timeDiff)` guard

### 🟢 LOW PRIORITY / ENHANCEMENTS

9. **Record Final Screen-Recording Demo** (Sahil's task)

10. **Update README with Final Screenshots + Live URL**  
    - File: `README.md`  
    - Action: Add screenshots + live GitHub Pages link

11. **Final Regression Test** (Divyans)  
    - Use `TESTING.md` checklist against live URL
    - Update `TESTING.md` with Week 4 test results

12. **Add More Journal Prompts** (Sanchari)  
    - File: `features.js`
    - Action: Add 5+ new daily prompts

---

## 🚫 Known Blockers

- ⚠️ **Supabase config** — If Supabase credentials are missing from `.env`, auth features will fail. Check `.env.example` → create `.env` with real keys.
- ⚠️ **GitHub Pages deployment** — Verify live URL manually at `https://bugbitcoder.github.io/PLACIDA/` — deployment status not confirmed.
- ⚠️ **Android build** — Requires Android Studio and proper SDK setup. See `android/` folder and Capacitor docs.

---

## 📁 Files Currently Being Worked On

| File | Status | Who |
|------|--------|-----|
| `project-progress/CURRENT_STATUS.md` | ✅ Created | Antigravity |
| `project-progress/IMPLEMENTATION_LOG.md` | ✅ Created | Antigravity |
| `project-progress/BUG_TRACKER.md` | ✅ Created | Antigravity |
| `project-progress/DEPLOYMENT_LOG.md` | ✅ Created | Antigravity |
| `project-progress/NEXT_ACTIONS.md` | ✅ Created | Antigravity |

---

## 🔁 How to Resume Work (Recovery Instructions)

If this session ends unexpectedly, the next agent should:

1. **Read `CURRENT_STATUS.md`** — understand overall project phase and % complete.
2. **Read `NEXT_ACTIONS.md` (this file)** — pick up from "Remaining Tasks" list.
3. **Read `BUG_TRACKER.md`** — check which bugs are `OPEN` or `IN_PROGRESS`.
4. **Read `IMPLEMENTATION_LOG.md`** — understand what was last modified and why.
5. **Run `git log --oneline -10`** — confirm latest commit hash matches `CURRENT_STATUS.md`.
6. **Run `git status`** — check for any uncommitted changes.
7. **Open the project** at `e:\DESIGN_LAB\Placida\`
8. **Continue from the top of the Remaining Tasks list.**

---

## 🎯 Recommended Next Step

> **Fix BUG-011 (Chatbot Crisis Detection)** — highest user impact, assigned to Ayushi.  
> File: `features.js` → search for `BOT_RULES` → add crisis keywords array → add modal trigger logic.

---

<!-- ALWAYS UPDATE THIS FILE BEFORE ENDING A SESSION -->
