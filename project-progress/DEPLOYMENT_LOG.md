# 🚀 PLACIDA — Deployment Log

> Tracks all deployment events: commits, build results, GitHub Pages status, and production verification.

---

## Deployment Environment

| Field | Value |
|-------|-------|
| **Platform** | GitHub Pages |
| **Repo** | `https://github.com/BugBitCoder/PLACIDA` |
| **Expected Live URL** | `https://bugbitcoder.github.io/PLACIDA/` |
| **Branch Deployed** | `main` |
| **Deploy Method** | Automatic from `main` branch on push |

---

## Deployment History

---

### Deployment #1 — Initial Deploy (Week 3)

| Field | Value |
|-------|-------|
| **Date** | ~Week of 2026-04-20 |
| **Commit** | Unknown (pre-log) |
| **Build Result** | ⚠️ Not recorded |
| **Status** | GitHub Pages configured |
| **Notes** | Initial deployment attempt as part of Week 3 Sahil tasks |

---

### Deployment #2 — Mobile Scroll Fix

| Field | Value |
|-------|-------|
| **Date** | 2026-05-31 |
| **Commit** | `fdf312a` |
| **Message** | fix: resolve mobile scroll lock bug on index page launch |
| **Build Result** | ✅ Pushed to `main` |
| **Status** | Should be live on GitHub Pages |

---

### Deployment #3 — PWA + Mobile Nav Fix

| Field | Value |
|-------|-------|
| **Date** | 2026-05-31 |
| **Commit** | `02c35bd` |
| **Message** | fix(mobile): add persistent bottom nav bar, fix PWA install scope, bump SW cache to v3 |
| **Build Result** | ✅ Pushed to `main` |
| **Status** | Should be live on GitHub Pages |

---

### Deployment #4 — Dynamic User Name + Supabase Fix

| Field | Value |
|-------|-------|
| **Date** | 2026-05-31 |
| **Commit** | `73616dd` |
| **Message** | fix(critical): dynamic user name from Supabase auth, restore real supabase.js, fix mobile nav scroll, fix PWA manifest |
| **Build Result** | ✅ Pushed to `main` |
| **Status** | Should be live on GitHub Pages |

---

### Deployment #5 — Android Capacitor Fix

| Field | Value |
|-------|-------|
| **Date** | 2026-05-31 |
| **Commit** | `b0d0e32` |
| **Message** | fix(android): install capacitor dependencies directly to fix build |
| **Build Result** | ✅ Pushed to `main` |
| **Status** | Android-specific fix |

---

### Deployment #6 — Full Feature Implementation

| Field | Value |
|-------|-------|
| **Date** | 2026-05-31 |
| **Commit** | `04827bd` |
| **Message** | feat: complete full feature implementation for Placida |
| **Build Result** | ✅ Latest commit on `main` |
| **Status** | ✅ Live (assumed — verify manually) |

---

## ✅ Production Verification Checklist

Run this checklist after every deployment:

- [ ] `https://bugbitcoder.github.io/PLACIDA/` loads without 404
- [ ] `index.html` — Mood logger functional
- [ ] `dashboard.html` — Chart and streak display
- [ ] `breathe.html` — Breathing animation cycles correctly
- [ ] `summary.html` — Weekly summary data renders
- [ ] `chatbot.html` — Bot responds, chat persists
- [ ] `insights.html` — Heatmap and trend stats load
- [ ] `resources.html` — Helplines displayed
- [ ] `mindful.html` — Affirmation deck works
- [ ] PWA installable from browser
- [ ] Service Worker caches pages (test offline)
- [ ] Dark/light mode toggle persists across refresh
- [ ] Mobile view (375px) — no layout breaks

---

<!-- APPEND NEW DEPLOYMENT ENTRIES BELOW THIS LINE -->
