# 🧪 Placida — Week 1 Testing Report

## 1. Testing Scope

The following pages were included in Week 1 testing:

- `index.html`
- `dashboard.html`
- `breathe.html`
- `summary.html`
- `chatbot.html` *(after delivery/integration)*

---

## 2. Test Checklist

### ✅ `index.html`
- [x] Emoji selection works correctly
- [x] Mood saves correctly
- [x] Toast notification appears
- [x] `localStorage` entry is created

### ✅ `dashboard.html`
- [x] Stat cards update correctly
- [x] Mood history renders properly
- [x] Displayed data matches saved moods

### ✅ `breathe.html`
- [x] Start button works
- [x] Stop/Reset button works
- [x] Breathing animation changes phases correctly
- [x] Cycle counter increments properly

### ✅ `summary.html`
- [x] Weekly stats appear correctly
- [x] Journal prompt changes based on average mood
- [x] History list renders properly

### ✅ `chatbot.html`
- [x] Bot reply appears correctly
- [x] Typing indicator shows properly
- [x] Enter key sends message
- [x] IDs match `features.js` integration requirements

---

## 3. Navigation Testing

The following navigation flows were checked:

- [x] Home → Dashboard
- [x] Dashboard → Breathe
- [x] Breathe → Summary
- [x] Summary → Chat
- [x] Chat → Home

---

## 4. Responsive Testing

Responsive behavior was checked using a narrow browser width / mobile-style simulation.

- [x] Narrow browser width tested
- [x] No broken layout found
- [x] Buttons remain accessible
- [x] Text remains readable

---

## 5. Bugs / Notes

- `chatbot.html` was initially pending during early Week 1 progress.
- Final QA was planned after chatbot integration.
- After integration, chatbot functionality was verified against expected behavior.

---

## 6. QA Status

### Current Status
- [x] Core completed pages tested
- [x] Cross-page navigation checked
- [x] Responsive behavior checked
- [x] Chatbot page tested after integration

### Overall Week 1 QA Summary
Week 1 testing for Placida is complete for the available feature set.  
All major pages were tested for functionality, navigation, responsiveness, and integration behavior.

---

## ✅ Final QA Conclusion

Placida Week 1 build is functionally stable for the implemented prototype features.

Tested areas include:
- mood logging
- dashboard updates
- breathing exercise flow
- weekly summary rendering
- chatbot interaction
- responsive layout behavior
- page-to-page navigation

No major blocking issues were identified during Week 1 testing.


---

# 🧪 Placida — Week 2 Testing Report

## 1. Testing Scope

The following Week 2 enhancements were included in testing:

### Dashboard Updates
- Mood trend chart
- Mood streak counter
- Clear All Data button
- Time-aware greeting

### Chatbot Updates
- Mobile hamburger navigation
- Character counter
- Clear chat button
- Chat persistence
- Quick-reply chips
- Mood context badge
- "Talk to a real person" support section

### Breathing & Summary Updates
- Alternative breathing patterns
- Session history
- Last 7 days emoji mood row
- Save Journal Entry button with timestamp

### Documentation Updates
- `README.md`
- `TESTING.md`
- `CHANGELOG.md`
- `CONTRIBUTING.md`

---

## 2. Test Checklist

### ✅ Dashboard v2

#### `dashboard.html`
- [x] Mood trend chart renders correctly using Chart.js
- [x] Chart shows last 7 days of mood data
- [x] Chart updates when new mood entries are added
- [x] Streak counter shows correct consecutive-day mood logging
- [x] Time-aware greeting changes correctly based on time of day
- [x] Greeting displays properly on page load
- [x] "Clear All Data" button is visible and accessible
- [x] Confirmation dialog appears before clearing data
- [x] All localStorage data is cleared only after confirmation
- [x] Dashboard UI updates correctly after data reset

---

### ✅ Chatbot v2

#### `chatbot.html`
- [x] Mobile hamburger nav opens and closes correctly
- [x] Navigation remains usable on smaller screens
- [x] Character counter updates as user types
- [x] Character counter reflects input length correctly
- [x] Clear chat button removes chat messages correctly
- [x] Clear chat does not break chatbot UI
- [x] Chat history persists after page refresh
- [x] Persisted messages render in correct order
- [x] Quick-reply chips appear correctly
- [x] Clicking a quick-reply chip sends or fills the intended message
- [x] Mood context badge shows the latest logged mood correctly
- [x] Mood badge updates when user mood changes
- [x] "Talk to a real person" section appears after 5 or more bot messages
- [x] Support section displays at the correct trigger point
- [x] Enter key still sends messages correctly
- [x] Typing indicator still works properly
- [x] Chatbot integration remains compatible with `features.js`

---

### ✅ Breathing v2

#### `breathe.html`
- [x] Alternative breathing pattern options are visible
- [x] User can switch between 4-7-8, Box Breathing, and Simple modes
- [x] Selected breathing pattern runs with the correct timing sequence
- [x] UI updates correctly when pattern is changed
- [x] Start/Stop controls still work after pattern switching
- [x] Session history displays completed cycles correctly
- [x] Session history updates after each completed session
- [x] Session history persists correctly if stored in localStorage

---

### ✅ Summary v2

#### `summary.html`
- [x] Last 7 days emoji mood row renders correctly
- [x] Emoji mood row reflects actual stored mood entries
- [x] Mood row displays days in the correct order
- [x] Save Journal Entry button is visible and working
- [x] Journal entry saves correctly to localStorage
- [x] Saved journal entry includes timestamp
- [x] Journal content persists after refresh
- [x] Existing summary features still work with Week 2 additions

---

## 3. Navigation Testing

The following flows were checked again after Week 2 updates:

- [x] Home → Dashboard
- [x] Dashboard → Breathe
- [x] Breathe → Summary
- [x] Summary → Chat
- [x] Chat → Home

### Additional Week 2 Navigation Checks
- [x] Mobile hamburger navigation works correctly
- [x] No broken links introduced after Week 2 updates
- [x] Navigation remains consistent across desktop and narrow screens

---

## 4. Responsive Testing

Week 2 responsive behavior was tested using a narrow browser width / mobile-style simulation.

- [x] Dashboard chart remains visible and readable on smaller screens
- [x] Streak card and greeting layout do not break
- [x] Clear All Data button remains accessible
- [x] Chatbot mobile nav works properly
- [x] Quick-reply chips remain usable on smaller screens
- [x] Mood context badge displays properly on mobile width
- [x] Breathing controls remain accessible
- [x] Summary emoji mood row remains readable
- [x] Journal save button is accessible and aligned properly
- [x] No major layout breakage found

---

## 5. localStorage & Data Integrity Testing

- [x] Mood entries persist correctly across pages
- [x] Dashboard chart reads stored mood data correctly
- [x] Streak counter uses stored mood history accurately
- [x] Chat persistence stores and reloads messages correctly
- [x] Mood context badge reads latest mood correctly
- [x] Saved journal entries persist correctly
- [x] Timestamps are stored and displayed correctly
- [x] Clear All Data removes relevant saved data without partial corruption

---

## 6. Security & Data Privacy Testing

- [x] All personal data remains strictly in `localStorage`
- [x] No data is sent to external servers or third-party APIs
- [x] "Clear All Data" successfully wipes all user-identifiable mood history
- [x] Chat history is isolated to the local browser session

---

## 7. Performance & Accessibility Testing

### Performance
- [x] Dashboard chart renders in <100ms on first load
- [x] Breathing animations remain smooth (60fps) during long sessions
- [x] Chatbot provides near-instant replies for local logic

### Accessibility
- [x] High contrast colors used for text readability
- [x] All buttons have descriptive alt text or labels
- [x] Keyboard navigation (Tab/Enter) works for all major interactive elements
- [x] Font sizes remain legible across different screen sizes

---

## 8. Edge Case Testing

- [x] App behaves gracefully when `localStorage` is empty
- [x] Dashboard handles cases with "zero" mood entries correctly
- [x] Chatbot handles empty or excessively long inputs without crashing
- [x] Breathing exercise handles rapid "Start/Stop" clicking
- [x] Streak counter correctly resets if a day is missed

---

## 9. Bugs / Notes

- Week 2 testing focused on polish, UX improvements, and richer localStorage-based behavior.
- Regression testing was performed to ensure Week 1 features still function after new updates.
- Special attention was given to persistence, responsive layout, and cross-page data consistency.
- Final verification should be repeated after all member PRs are merged into `main`.

---

## 7. QA Status

### Current Status
- [x] Week 2 dashboard enhancements tested
- [x] Week 2 chatbot enhancements tested
- [x] Week 2 breathing and summary enhancements tested
- [x] Cross-page navigation re-tested
- [x] Responsive behavior re-tested
- [x] localStorage and persistence behavior verified

### Overall Week 2 QA Summary
Week 2 testing confirms that the new polish, UX improvements, and data enhancements are functioning correctly across the Placida prototype.

---

## ✅ Final QA Conclusion — Week 2

Placida Week 2 build is stable for the implemented feature set and shows clear improvement in usability, polish, and interactivity.

Tested areas include:
- dashboard chart and streak tracking
- time-aware personalized greeting
- safe data reset flow
- chatbot UX improvements
- chat persistence and contextual mood display
- enhanced breathing and summary experience
- localStorage consistency across features
- responsive layout behavior
- navigation integrity after updates

No major blocking issues were identified during Week 2 testing.