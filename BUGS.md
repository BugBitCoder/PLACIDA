# 🐛 Placida — Known Bugs

This document tracks identified issues in the Placida prototype.

| ID | Bug Description | Page | Severity | Reported By | Status |
|---|---|---|---|---|---|
| **BUG-001** | Summary page nav showing 'Chat' instead of 'Summary' as active | `summary.html` | Low | Divyans | Open |
| **BUG-002** | Toast message z-index clips behind modal | `dashboard.html` | Low | Divyans | Open |
| **BUG-003** | User notes in Weekly Summary history lack HTML escaping (XSS risk) | `summary.html` | High | Antigravity | Open |
| **BUG-004** | Stats cards on Dashboard use static colors regardless of average mood | `dashboard.html` | Low | Antigravity | Open |
| **BUG-005** | Chatbot messages do not persist after page refresh (pending Week 2 integration) | `chatbot.html` | Medium | Ayushi | In Progress |
| **BUG-006** | Negative "time ago" display if system clock is behind entry timestamp | `dashboard.html` | Low | Antigravity | Open |

## Bug Details

### BUG-003: XSS in Weekly Summary
In `features.js`, the `renderWeeklyHistory` function directly injects `entry.note` into the innerHTML without escaping. While notes are stored locally, malicious input scripts could execute if a user manually modifies their `localStorage`.

### BUG-004: Static Stats Styling
The dashboard displays the average mood score in a fixed teal color (`var(--accent-teal)`), which may give a misleading "healthy" impression even if the average mood score is low (e.g., 1.0).
