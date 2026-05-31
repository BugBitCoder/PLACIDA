# Placida — Technical Architecture by Team Member

This document breaks down the specific technologies and engineering implementations built by each team member for Placida.

---

### 💻 SAHIL: Lead Frontend Developer 
**Your Tech Stack:** HTML5, CSS3, Vanilla JavaScript, Chart.js, Progressive Web App (PWA) Service Workers

**What you built & how:**
- **PWA Architecture:** You built the app to work entirely offline. You used a custom Service Worker (`sw.js`) with a "Cache-First" strategy. When a user opens the app, it loads assets from the browser's Cache Storage API instantly (under 200ms) without needing the internet.
- **State Management:** You avoided React/Vue to keep the app lightweight. You managed global state using pure Vanilla JS. All user data (like the Mood Logger history) is converted to JSON and securely saved locally using the `localStorage` API so data never leaves the user's device.
- **Glassmorphism UI:** To ensure the blur effects didn't lag the browser, you used hardware-accelerated CSS (`transform: translate3d`) to push the rendering workload to the GPU, keeping animations at a smooth 60 Frames Per Second.
- **Data Viz:** You integrated `Chart.js` to render complex HTML5 `<canvas>` graphs on the Dashboard using purely local data.

---

### 🤖 AYUSHI: AI & Chatbot Developer
**Your Tech Stack:** Pollinations AI REST API, Asynchronous JavaScript (Promises), JSON, Regular Expressions (RegEx)

**What you built & how:**
- **Keyless LLM Engine:** Instead of using expensive servers to hide API keys, you used Pollinations AI's keyless endpoint. You sent HTTP POST requests via the `fetch()` API to stream the AI responses directly into the browser for free, making it infinitely scalable.
- **Async Rendering:** You used JavaScript `async/await` to handle the network latency. While waiting for the AI response, your script injects a CSS-animated "typing..." indicator so the UI never freezes.
- **System Prompting:** You programmatically inject a hidden "System Prompt" into every JSON payload to strictly bound the AI's behavior, ensuring it acts as a listener and doesn't give unauthorized medical advice.
- **Crisis Detection:** You engineered a local RegEx (Regular Expression) parser. Before an API request is even sent, your code scans the user's input for high-risk keywords (e.g., self-harm). If triggered, it aborts the API call and executes a `window.location.href` redirect to the SOS helplines immediately.

---

### 🧘‍♀️ SANCHARI: Wellness Features Developer
**Your Tech Stack:** CSS3 Keyframe Animations, HTML5 Canvas API, Web Audio API

**What you built & how:**
- **Main-Thread Optimized Animations:** For Guided Breathing, you avoided JavaScript animations (which block the main thread and cause lag). Instead, you built a pure CSS state-machine using `@keyframes` and `calc()` functions to mathematically control the exact milliseconds required for the 4-7-8 breathing cycles.
- **Zen Canvas:** You utilized the HTML5 `<canvas>` 2D rendering context. You attached event listeners to `mousedown`, `mousemove`, and `mouseup` to capture exact X/Y screen coordinates, using `lineTo()` and `stroke()` methods to render smooth, anti-aliased drawing graphics in real time.
- **Asynchronous Audio:** For the Sound Tiles, you dynamically instantiated HTML5 `Audio` objects. You built boolean state flags to prevent overlapping playbacks, ensuring the browser doesn't run out of memory from stacking audio buffers.

---

### 📊 DIVYANS: QA, Analytics & Documentation Lead
**Your Tech Stack:** Supabase (PostgreSQL), Supabase JS SDK, SQL Row Level Security (RLS), JavaScript Blob Exporting

**What you built & how:**
- **Serverless Database Integration:** You synced the Community Affirmation Wall globally by integrating the Supabase JavaScript Client SDK, connecting the static frontend directly to a serverless PostgreSQL database.
- **Row Level Security (RLS):** Because the frontend is public, you wrote RLS policies directly in SQL to secure the database. You allowed public `INSERT` and `SELECT` for the Affirmation Wall, but strictly denied public read access for the Admin Feedback table to prevent data leaks.
- **Timezone Normalization:** You fixed timestamp drifting issues by implementing a script that intercepts Supabase ISO strings and coerces them into strict UTC format (`+ 'Z'`) before rendering them to the DOM.
- **Client-Side Data Exporting:** To export Admin reports without a backend server, you engineered a client-side exporter. The script takes the raw JSON array from Supabase, formats it into CSV, converts it into a `Blob` (Binary Large Object), and uses `URL.createObjectURL()` to force the browser to trigger a local file download natively.
