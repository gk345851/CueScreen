# CueScreen: AI Tutor Screener for Cuemath 🎙️🤖

**CueScreen** is an automated, voice-first AI screening platform built for the Cuemath tutor recruitment pipeline. It replaces the expensive, slow, and unscalable 10-minute human HR screening calls with a high-fidelity, interactive AI recruiter that assesses critical soft skills in real-time.

---

## 🎯 The Problem
Cuemath hires hundreds of tutors monthly. Every candidate requires a screening call to evaluate:
- **Communication Clarity**: Can they explain concepts without stumbling?
- **Patience & Empathy**: How do they handle a struggling student?
- **Simplification Ability**: Can they explain fractions to a 9-year-old?
- **Temperament & Warmth**: Are they encouraging and professional?

**CueScreen conducts these 5-minute interviews autonomously, generating an evidence-based rubric and report for the HR team.**

---

## 🚀 Live Demo & Submission Assets
- **Live URL:** [https://cue-screen.vercel.app/](https://cue-screen.vercel.app/)
- **Video Walkthrough:** [https://www.loom.com/share/7646e8161fd14a9d9b28e4645ac85c82](https://www.loom.com/share/7646e8161fd14a9d9b28e4645ac85c82)
- **GitHub Repository:** [https://github.com/gk345851/CueScreen](https://github.com/gk345851/CueScreen)

---

## 🛠️ The Tech Stack (Engineered for Scale & Cost)
- **Frontend:** React + Vite (Vanilla CSS)
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose) — Handles candidate persistence & security.
- **AI Core:** **Google Gemini 2.5 Flash** (Primary Reasoning & Transcription).
- **Authentication:** JWT + Bcrypt hashing.
- **Email System:** Nodemailer + Gmail SMTP for secure Password Recovery.
- **UI/Charts:** Recharts (SVG Radar Analysis).

---

## 🧠 Smart Choices & Technical Tradeoffs

### 1. The "Gemini Multimodal" Transcription Pivot
Originally, the project considered OpenAI Whisper. However, to stay within a **$0.00 infrastructure budget**, I pivoted to using **Gemini 2.5 Flash's** native audio understanding. We stream base64 `.webm` audio directly to the model. 
- **Result:** Zero-cost transcription with near-perfect accuracy and significantly lower latency than separate STT API calls.

### 2. Evidence-Based Evaluation (Anti-Hallucination)
LLMs are prone to "vibes-based" grading. To solve this, the **Evaluation Rubric** (in `server/prompts/evaluator.js`) enforces a strict rule: **No score can be given without a direct verbatim quote from the transcript.**
- **Result:** Every grade (Clarity, Patience, etc.) is auditable. HR doesn't just see a "9/10"; they see the exact sentence that earned it.

### 3. Cuemath Branding Pivot (Flat UI)
During the polish phase, I pivoted away from generic "Glassmorphism" to match **Cuemath's specific brand identity**:
- High-contrast **Black & Yellow** palette (`#FFB800`).
- Geometric typography (**Poppins**).
- **Hard, 2px solid borders** and zero border-radius to match Cuemath's gamified EdTech aesthetic.

### 4. Resilient Interview State
Using `localStorage` and Backend Persistence, CueScreen handles "the messy reality":
- **Network drops?** The app resumes exactly where the candidate left off.
- **Accidental Refresh?** The AI memory remains intact.

---

## 📊 The Rubric (Dimensions Assessed)
After each 5-minute interaction, CueScreen generates a **Point-in-Time Radar Graph** across 5 key metrics:
1. **Clarity & Conciseness**: Measuring if the tutor is direct or prone to rambling.
2. **Pedagogical Simplification**: Assessing the "6-Year-Old Test" for complex topics.
3. **Patience & Empathy**: How the tutor reacts to simulated student confusion.
4. **Warmth & Encouragement**: Level of positive reinforcement.
5. **English Fluency**: Standardized linguistic capability assessment.

---

## 🔮 What's Next? (Future Roadmap)
- [ ] **Real-time VAD**: Removing the push-to-talk button for automated silence detection.
- [ ] **Native Video Feedback**: Analyzing facial expressions during the explanation phase.
- [ ] **HR Admin Panel**: Multi-tenant dashboard to sort candidates by "Simplicity" or "Clarity" scores.

---

## 🛠️ Local Setup
1. Clone the repo.
2. Run `npm install` in both `client/` and `server/` folders.
3. Add your `GEMINI_API_KEY`, `MONGO_URI`, and `SMTP_PASS` to `server/.env`.
4. Run `npm start` (Backend) and `npm run dev` (Frontend).
