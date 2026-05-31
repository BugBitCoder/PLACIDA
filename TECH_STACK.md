# Placida — Complete Technical Architecture & Tech Stack

This document serves as a comprehensive deep-dive into the engineering, architecture, and technology stack of Placida. It breaks down every aspect of the project from basic implementations to complex algorithms, categorized by the core development roles.

---

## 1. Frontend Architecture & Infrastructure
**Lead Frontend Developer: Sahil**

### The Basics: HTML5, CSS3, & Vanilla JavaScript
Placida was intentionally built without heavy frontend frameworks (like React, Vue, or Angular). 
- **Why?** To ensure lightning-fast load times, minimal bundle sizes, and maximum accessibility on low-end mobile devices.
- **Implementation:** The entire DOM (Document Object Model) is manipulated using pure Vanilla JavaScript. Dynamic elements (like rendering the Mood Logger history or injecting Affirmation Wall messages) are handled via `document.createElement()` and `innerHTML` parsing.

### Complex Implementation: Progressive Web App (PWA) & Offline-First Design
Placida is engineered to function entirely without an internet connection.
- **Service Workers (`sw.js`):** A custom Service Worker script intercepts all outbound HTTP network requests using the `fetch` event listener. 
- **Caching Strategy:** It utilizes a **"Cache-First, Network Fallback"** strategy. Upon first visit, the Service Worker caches all critical assets (HTML, CSS, JS, images) into the browser's Cache Storage API. On subsequent visits, the app loads directly from the cache (usually under 200ms), bypassing the network entirely.
- **Manifest (`manifest.json`):** Allows the web app to be installed natively on iOS and Android home screens, functioning completely indistinguishably from a native application.

### Memory & State Management
- **Local Storage API:** Persistent data (like mood logs, journal entries, and streaks) is serialized into JSON and stored in the browser's `localStorage`. This ensures maximum data privacy (as data never leaves the device) and survives browser restarts.
- **Session Storage:** Volatile data (like the Admin Dashboard passcode authentication state) is managed via `sessionStorage`, automatically clearing when the tab is closed to maintain security.

### Hardware-Accelerated UI (Glassmorphism)
- **CSS Compositing:** The Glassmorphism UI is achieved using `backdrop-filter: blur()`. Because blurs are computationally expensive, hardware-accelerated CSS properties like `transform: translate3d(0,0,0)` are applied. This forces the browser to offload the rendering workload from the CPU's main thread to the GPU, guaranteeing a smooth 60 Frames Per Second (FPS) animation rate.
- **Data Visualization:** The `Chart.js` library is implemented to render complex, responsive `<canvas>` graphs on the Dashboard, interpreting the local JSON mood data without server-side processing.

---

## 2. Artificial Intelligence & Crisis Mitigation
**AI & Chatbot Developer: Ayushi**

### The Basics: REST APIs & Asynchronous JavaScript
- **API Integration:** The AI Chatbot communicates via HTTP POST requests using the native `fetch()` API.
- **Async/Await:** Network latency is managed using asynchronous JavaScript (`async/await` and Promises). While the network resolves the API request, the DOM dynamically injects CSS-animated "typing..." indicators, ensuring the UI remains responsive and non-blocking.

### Complex Implementation: Keyless LLM & Prompt Engineering
- **Pollinations AI:** Traditional chatbots require secure backend servers to hide API keys from the public client. Placida bypasses this infrastructure cost entirely by utilizing a keyless endpoint provided by Pollinations AI. This brings the marginal cost per user interaction down to absolute zero, making the platform infinitely scalable.
- **System Prompts:** User inputs are not sent raw. The JavaScript engine programmatically prepends a hidden "System Prompt" to every JSON payload. This prompt strictly defines the LLM's behavioral boundaries—instructing it to act as a compassionate listener and preventing it from giving unauthorized medical advice.

### Complex Implementation: Client-Side Crisis Detection Algorithm
- **Algorithmic Safety Net:** To ensure zero latency during psychiatric emergencies, crisis detection happens entirely client-side, *before* the API request is even dispatched.
- **RegEx Parsing:** The algorithm utilizes Regular Expressions (`RegEx`) to scan the user's input string against a dictionary of high-risk string literals (e.g., suicide, self-harm, panic). 
- **Execution Override:** If a match triggers the threshold, the script immediately aborts the `fetch()` request and executes a DOM redirect (`window.location.href`) to the SOS Page, connecting the user to verified government helplines. This protects the user and limits platform liability.

---

## 3. Interactive Wellness Engineering
**Wellness Features Developer: Sanchari**

### The Basics: Interactive DOM & State Toggles
- The Wellness modules (Breathe, Relax) rely on complex state toggling, applying CSS classes dynamically to trigger visual changes based on user interaction.

### Complex Implementation: Main-Thread Optimized Animation Engine
- **CSS State-Machines:** JavaScript-based animations (like `requestAnimationFrame`) can block the main thread and cause UI stuttering. For the Guided Breathing tool, pure CSS state-machines were built using `@keyframes`. 
- **Mathematical CSS Timings:** CSS `calc()` functions and dynamic CSS variables (`--breathe-duration`) mathematically control the exact milliseconds required for complex breathing patterns (like the 4-7-8 cycle), ensuring perfect synchronicity without CPU overhead.

### Complex Implementation: HTML5 Canvas API
- **Zen Canvas:** For the drawing module, the HTML5 `<canvas>` 2D rendering context is utilized. The engine attaches event listeners to `mousedown`, `mousemove`, and `mouseup` (as well as touch equivalents for mobile devices). 
- **Coordinate Mapping:** The script captures exact X/Y screen coordinates, dynamically calculating vectors and executing `lineTo()` and `stroke()` methods to render smooth, anti-aliased graphics in real-time.

### Complex Implementation: Asynchronous Audio Engine
- **Web Audio:** The Sound Tiles utilize dynamic instantiation of the HTML5 `Audio` object. 
- **Memory Management:** The script handles asynchronous audio loading and utilizes boolean state flags to prevent overlapping playbacks. This garbage-collection strategy ensures the browser doesn't run out of memory or crash from stacking uncompressed audio buffers.

---

## 4. Backend Database, Analytics & Security
**QA, Analytics & Documentation Lead: Divyans**

### The Basics: Supabase (PostgreSQL) Integration
- **Serverless Backend:** For the Community Affirmation Wall, Placida relies on Supabase, an open-source Firebase alternative backed by PostgreSQL.
- **SDK Implementation:** The frontend connects directly to the database via REST using the Supabase JavaScript Client SDK (`@supabase/supabase-js`).

### Complex Implementation: Row Level Security (RLS)
- **The Threat Model:** Because Placida is a client-side application, the Supabase Anon Key is publicly exposed in the browser. Without security, malicious actors could query, delete, or alter the entire database.
- **SQL Security Policies:** To prevent this, Row Level Security (RLS) policies were engineered directly in SQL. 
    - For the *Affirmation Wall*, the RLS policy allows public `INSERT` and `SELECT` (so anyone can post and read). 
    - For the *Admin Feedback Table*, the policy strictly denies public read access, ensuring that sensitive user data cannot be queried via the Anon Key.

### Complex Implementation: Timezone Normalization & Parsing
- **Timestamp Drift:** JavaScript's native `Date()` constructor often misinterprets raw database timestamps, shifting them based on the user's local timezone (e.g., IST vs EST).
- **The Fix:** A data parser was implemented to intercept incoming Supabase ISO strings and coerce them into strict UTC format (by appending a `+ 'Z'`) before rendering them to the DOM, ensuring absolute chronological accuracy across the globe.

### Complex Implementation: Client-Side File Generation (Data Exporting)
- **The Problem:** The Admin Panel requires Excel/JSON exports of user data, which normally requires a backend server (like Node.js or Python) to compile the file.
- **The Solution:** A client-side exporter was engineered. The JavaScript engine takes the raw JSON array from Supabase, maps it into CSV format, and converts it into a Binary Large Object (`Blob`). It then uses `URL.createObjectURL()` to force the browser to trigger a local file download. This provides enterprise-level data exporting with zero backend compute costs.
