# Video Walkthrough Script (2-5 Minutes)

Use this script as a guide for your Loom/Screen recording. Keep the tone professional, enthusiastic, and focused on **Engineering Decisions**.

---

### Phase 1: The Intro (0:00 - 0:30)
- **Visual:** Show the Landing Page (Login/Register).
- **Say:** "Hi, I'm Gaurav, and this is **CueScreen**—an AI-powered tutor screening platform for Cuemath. I chose Problem 3 because I wanted to see if we could automate the soft-skill evaluation of hundreds of tutors while keeping the interaction feeling warm and human."
- **Visual:** Log in or Sign up.

### Phase 2: The Logic (0:30 - 1:30)
- **Visual:** Go to the Welcome Screen / Interview interface.
- **Say:** "I built this with React, Node.js, and MongoDB. One of my key **tradeoffs** was the AI stack. I pivoted from using separate transcription and reasoning APIs to a single multimodal stream with **Gemini 2.5 Flash**. This dropped my latency and removed API costs entirely."
- **Visual:** Start the interview. Record yourself answering a question (e.g., "Explain fractions").
- **Say:** "You’ll notice the interface uses the **Cuemath Flat UI** branding. I wanted the candidate to feel like they were already inside a Cuemath tool, providing a sense of 'Delight' through professional aesthetics."

### Phase 3: The Assessment (1:30 - 2:30)
- **Visual:** Finish the interview and let the report generate.
- **Say:** "This is the most critical part. Instead of generic feedback, I engineered the evaluator to be **evidence-based**. As you can see on this report, every score—like Clarity or Simplicity—is backed by a **direct verbatim quote** from the candidate."
- **Visual:** Hover over the Recharts Radar Graph.
- **Say:** "This allows HR to audit the AI’s judgment immediately without re-listening to the entire 5-minute recording."

### Phase 4: Security & Process (2:30 - 3:15)
- **Say:** "Security was a priority. We use Bcrypt for password hashing and a Proxy backend architecture so my Gemini API keys stay hidden on the server. During development, I faced a major CORS challenge between Railway and Vercel, which I solved by implementing a dynamic origin-check middleware."

### Phase 5: The Outro (3:15 - 3:30)
- **Say:** "That’s CueScreen—Functional, secure, and ready to scale Cuemath’s tutor onboarding. Thanks for watching!"
