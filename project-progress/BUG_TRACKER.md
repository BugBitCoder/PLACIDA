# BUG TRACKER — Placida Production Audit

| ID | Bug | Severity | Status | Fix Location |
|----|-----|----------|--------|--------------|
| BUG-001 | summary.html nav link missing `active` class | Low | ✅ Pre-existing (already correct) | summary.html L236 |
| BUG-002 | Toast hidden behind SOS modal (z-index: 999 < modal z-index: 500... no, toast was 999 but modals can have confirm at z-1000) | Medium | ✅ Fixed | style.css — z-index raised to 9999 |
| BUG-003 | XSS: entry.note injected unsanitized into innerHTML in features.js renderWeeklyHistory() | High | ✅ Fixed | features.js L550 — escapeHtmlChat() |
| BUG-004 | statAvg card has static teal color regardless of value | Low | 🔲 Deferred (cosmetic) | dashboard.html |
| BUG-005 | SOS modal freezes iOS viewport scroll (body overflow hidden) | Critical | ✅ Fixed | All 9 pages + style.css |
| BUG-006 | formatTime() returns "NaN ago" for future-timestamp entries | Medium | ✅ Fixed | script.js L40 — Math.max(0, diff) |
| BUG-007 | getUserDisplayName() returns stale cached name from previous user session | High | ✅ Fixed | feedback.html — async Supabase session lookup |
| BUG-008 | dashboard.html hardcodes "Sahil" in HTML before JS runs | High | ✅ Fixed | dashboard.html L54 |
| BUG-009 | renderGreetingWithAuth uses insufficient name field priority | Medium | ✅ Fixed | script.js L157 |
| BUG-010 | Feedback submit always synchronous — getUserDisplayName called after async Supabase call | Medium | ✅ Fixed | feedback.html submitFeedback() made async |
| BUG-011 | No feedback duplicate prevention | Medium | ✅ Fixed | feedback.html — 1-hour check with confirm() |
| BUG-012 | Feedback form has no required field validation | Medium | ✅ Fixed | feedback.html — validate hasRating before submit |
| BUG-013 | No CSS breakpoints for screens < 380px (iPhone SE, Galaxy A03) | Low | ✅ Fixed | style.css @media (max-width: 380px) |
| BUG-014 | Feature.js renderWeeklyHistory injects emoji directly without sanitization | Medium | ✅ Fixed as part of BUG-003 fix |
