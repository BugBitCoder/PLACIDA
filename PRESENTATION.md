# Presentation Script: Placida

🕒 **0:00 – 1:00 | Introduction (Sahil)**

Good morning everyone,

Today we are presenting our project called Placida.

Mental wellness is something that is often ignored in our daily lives. While there are many apps available, most of them are either too complicated to use, require expensive subscriptions, or raise concerns about privacy — especially when sensitive emotional data is sent to external servers.

That is exactly the problem we wanted to solve.

So we built Placida — a human-centered, privacy-first, and offline wellness companion. It is designed to be simple, calm, and completely run inside the user’s browser, ensuring that all personal data stays on the device itself.

🎨 **1:00 – 2:00 | Design Process (Team)**

To design Placida, we followed a structured Design Thinking approach.

We started by understanding real user needs through user personas, representing different mental health situations and emotional states.

We then created empathy maps to understand what users feel, think, say, and do during stress or emotional imbalance.

Finally, we analyzed the complete user journey to identify where current solutions fail — especially in terms of complexity, emotional overload, and lack of privacy.

Based on this, we designed a calm and minimal interface, using a dark glassmorphism theme that reduces visual stress and cognitive load.

💻 **2:00 – 7:00 | Live Demo**
📈 **Part 1: Awareness (Sahil)**

Now I will walk you through the application.

On the landing page, users can quickly log their mood using simple emoji-based selection. This removes friction — just one click is enough to record how they feel.

Once logged, the dashboard updates in real time.

Here, you can see:
- The Mood Trend Chart, built using Chart.js
- A streak counter, which encourages consistency
- And a time-aware greeting, which personalizes the experience based on the user’s time of day

This helps users become more aware of their emotional patterns over time.

💬 **Part 2: Support (Ayushi)**

Next is the chatbot support system.

Here, users can interact using quick-reply chips or free text input.

We also have:
- A character counter to guide message length
- A mood context badge, which helps the system understand emotional tone
- And persistent memory using localStorage, so conversations are not lost when the page refreshes

In addition, if the system detects high distress signals, it gently shows professional help resources, ensuring safety-first design.

🌬️ **Part 3: Action & Reflection (Sanchari)**

Now moving to the wellness tools.

The Guided Breathing Module offers techniques like:
- 4-7-8 breathing
- Box breathing

These are shown with smooth animations to help users follow along easily.

We also track session history so users can see their usage over time.

Next, the Weekly Summary section shows emotional patterns using a 7-day mood strip.

Finally, in the journaling feature, users can write reflections which are automatically saved with timestamps, helping them track their mental journey over time.

⚙️ **7:00 – 8:00 | Tech Stack (Sahil)**

Placida is built using simple but powerful web technologies:
- Frontend: HTML5, CSS3, and Vanilla JavaScript
- Styling: Glassmorphism UI for a calm visual experience
- Storage: localStorage, ensuring complete offline privacy
- Data Visualization: Chart.js v4.4.0
- Additionally, it is PWA-enabled, meaning it can work like an app even without internet using service workers

The key design principle here is: **no backend, no data leakage, full privacy**

📊 **8:00 – 9:00 | Feedback Results (Divyans)**

During our initial user testing phase, we observed some important feedback.

Users especially appreciated:
- The no-login experience, which made onboarding instant
- The clean and calming interface, which felt non-overwhelming

However, we also identified some improvement areas:
- Some users felt feature discovery could be improved
- Navigation between modules can be made more intuitive

We are actively working on these refinements.

🔮 **9:00 – 10:00 | Future Scope & Wrap-up (Team)**

Looking ahead, we have several exciting improvements planned for Placida.

First, we aim to add optional cloud sync, allowing users to access their data across devices while still keeping privacy intact.

Second, we are exploring a therapist connectivity feature, which could help users reach real professionals when needed.

Third, we plan to convert Placida into a mobile application using Capacitor, making it available on Android and iOS.

Finally, we are considering integrating a lightweight AI model, which can provide more personalized emotional support while still maintaining privacy-first design principles.

🎤 **Closing**

In conclusion, Placida is not just an application — it is a step towards making mental wellness more accessible, private, and effortless for everyone.

Thank you.
