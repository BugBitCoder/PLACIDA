# 🐛 PLACIDA — Bug Tracker

> Comprehensive bug tracking with root causes, fixes, and validation.  
> Statuses: `OPEN` | `IN_PROGRESS` | `FIXED` | `VERIFIED`

---

## Summary Table

| Bug ID | Description | Severity | Assigned | Status |
|--------|-------------|----------|----------|--------|
| BUG-001 | Summary page nav shows 'Chat' instead of 'Summary' as active | Low | Divyans | OPEN |
| BUG-002 | Toast message z-index clips behind modal | Low | — | OPEN |
| BUG-003 | User notes in Weekly Summary lack HTML escaping (XSS risk) | High | — | OPEN |
| BUG-004 | Stats cards use static colors regardless of average mood | Low | — | OPEN |
| BUG-005 | Chatbot messages don't persist after page refresh | Medium | Ayushi | FIXED |
| BUG-006 | Negative "time ago" if system clock is behind entry timestamp | Low | — | OPEN |
| BUG-007 | Mobile scroll lock on index page launch | High | Sahil | FIXED |
| BUG-008 | Hardcoded "Sahil" username shown on all devices | Critical | Sahil | FIXED |
| BUG-009 | PWA install scope incorrect for GitHub Pages | High | Sahil | FIXED |
| BUG-010 | Android Capacitor build failure | High | Sahil | FIXED |
| BUG-011 | Chatbot crisis detection insufficient — needs more keywords | High | Ayushi | IN_PROGRESS |
| BUG-012 | Dashboard missing "Most-used feature" stat | Medium | Sanchari | IN_PROGRESS |
| BUG-013 | Mobile responsiveness issues on smaller screens | Medium | Sahil | IN_PROGRESS |

---

## Detailed Bug Reports

---

### BUG-001 — Summary Page Nav Active State
**Description:** The `summary.html` page nav highlights 'Chat' as active instead of 'Summary'.  
**Severity:** Low  
**Status:** OPEN  
**Root Cause:** Active class assigned to wrong nav item in `summary.html`.  
**Fix:** Update nav active class to match the 'Summary' link element.  
**Validation:** Load `summary.html` → confirm 'Summary' nav item is highlighted.

---

### BUG-002 — Toast Z-Index Behind Modal
**Description:** Toast notifications appear behind modals on `dashboard.html`.  
**Severity:** Low  
**Status:** OPEN  
**Root Cause:** Toast `z-index` lower than modal overlay `z-index`.  
**Fix:** Increase toast `z-index` to exceed modal overlay value.  
**Validation:** Trigger toast while modal is open → confirm toast appears on top.

---

### BUG-003 — XSS Risk in Weekly Summary Notes
**Description:** `features.js` → `renderWeeklyHistory()` directly injects `entry.note` into `innerHTML` without escaping.  
**Severity:** High  
**Status:** OPEN  
**Root Cause:** No HTML sanitization on user-supplied text rendered as innerHTML.  
**Fix:** Use `textContent` instead of `innerHTML`, or apply an HTML escape function before insertion.  
**Validation:** Enter `<script>alert('xss')</script>` as a note → confirm it doesn't execute.

---

### BUG-004 — Static Stats Card Colors
**Description:** Dashboard stats cards always show teal color regardless of actual mood average.  
**Severity:** Low  
**Status:** OPEN  
**Root Cause:** Static CSS class applied; no dynamic color logic based on mood score.  
**Fix:** Add conditional coloring — green (≥4), yellow (2–3.9), red (≤1.9).  
**Validation:** Set mood average to 1.0 → confirm card does NOT appear green/teal.

---

### BUG-005 — Chatbot Messages Not Persisting
**Description:** Chatbot conversation history lost on page refresh.  
**Severity:** Medium  
**Status:** FIXED  
**Root Cause:** Chat messages not saved to `localStorage`.  
**Fix:** Ayushi added `localStorage` persistence for chat history in Week 2.  
**Validation:** Send 5 messages → refresh page → confirm messages reload.  
**Commit:** Week 2 Ayushi branch merge

---

### BUG-006 — Negative "Time Ago" Display
**Description:** "Time ago" shows negative values if system clock is behind the stored timestamp.  
**Severity:** Low  
**Status:** OPEN  
**Root Cause:** No guard against negative `Date.now() - entryTimestamp` values.  
**Fix:** Math.max(0, timeDiff) or show "Just now" if diff < 0.  
**Validation:** Set system clock back 5 minutes → verify no negative time display.

---

### BUG-007 — Mobile Scroll Lock on Index Launch
**Description:** On mobile, the body scroll locks when `index.html` loads.  
**Severity:** High  
**Status:** FIXED  
**Root Cause:** `overflow: hidden` applied to body during onboarding modal display.  
**Fix:** Removed body overflow lock; added independent modal scrolling.  
**Commit:** `fdf312a`

---

### BUG-008 — Hardcoded "Sahil" Username
**Description:** Every device shows "Sahil" as the user name regardless of who logged in.  
**Severity:** Critical  
**Status:** FIXED  
**Root Cause:** Username hardcoded in JS/HTML across multiple files.  
**Fix:** Replaced with dynamic user name from Supabase auth session.  
**Commit:** `73616dd`

---

### BUG-009 — PWA Manifest Scope Incorrect
**Description:** PWA install scope doesn't account for GitHub Pages subdirectory path.  
**Severity:** High  
**Status:** FIXED  
**Root Cause:** `manifest.json` scope set to `/` instead of `/PLACIDA/`.  
**Fix:** Updated scope and start_url to `/PLACIDA/`.  
**Commit:** `02c35bd`

---

### BUG-010 — Android Capacitor Build Failure
**Description:** Android build fails when Capacitor dependencies are missing.  
**Severity:** High  
**Status:** FIXED  
**Root Cause:** Capacitor packages not installed in the project.  
**Fix:** Installed Capacitor dependencies directly.  
**Commit:** `b0d0e32`

---

### BUG-011 — Chatbot Crisis Detection Insufficient
**Description:** Chatbot doesn't reliably detect crisis keywords → helpline modal not shown.  
**Severity:** High  
**Status:** IN_PROGRESS  
**Root Cause:** `BOT_RULES` in `features.js` missing many crisis trigger phrases.  
**Fix Needed:** Expand keyword list in `BOT_RULES`; after 3+ crisis keywords → show helpline modal.  
**Assigned:** Ayushi  
**Validation:** Type "I want to hurt myself" → confirm helpline modal appears.

---

### BUG-012 — Dashboard Missing "Most-Used Feature" Stat
**Description:** Users expect to see which feature they use most; Dashboard doesn't show this.  
**Severity:** Medium  
**Status:** IN_PROGRESS  
**Root Cause:** Feature usage tracking not implemented.  
**Fix Needed:** Add usage counters per feature (mood, breathe, chat, journal) to `localStorage`; display on Dashboard.  
**Assigned:** Sanchari

---

### BUG-013 — Mobile Responsiveness (Small Screens)
**Description:** Some UI elements overlap on phones with screens < 380px wide.  
**Severity:** Medium  
**Status:** IN_PROGRESS  
**Root Cause:** CSS breakpoints don't account for very small screens.  
**Fix Needed:** Add `@media (max-width: 380px)` overrides in `style.css`.  
**Assigned:** Sahil

---

<!-- ADD NEW BUGS BELOW THIS LINE -->
