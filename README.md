# CueScreen: AI Tutor Screener for Cuemath 🎙️🤖

**CueScreen** is an automated, voice-first AI screening platform built for the Cuemath tutor recruitment pipeline. It replaces the expensive, slow, and unscalable 10-minute human HR screening calls with a high-fidelity, interactive AI recruiter that assesses critical soft skills in real-time.

---

## 🎯 Why Problem 3? (The Choice)
Out of the three challenges, I selected the **AI Tutor Screener** for two primary reasons:
- **Scaling Quality:** Cuemath's biggest bottleneck isn't content generation or study tools, but the human-intensive process of vetting tutors. Automating this has the highest business ROI.
- **Technical Complexity:** Building a natural voice-based conversational AI that evaluates 'soft skills' (patience, warmth) is a multi-dimensional engineering challenge. It required a deep dive into multimodal LLM architectures and real-time audio handling.

---

## 🚀 Live Demo & Submission
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
LLMs are prone to "vibes-based" grading. To solve this, the evaluation engine enforces a strict rule: **No score can be given without a direct verbatim quote from the transcript.**
- **Result:** Every grade is auditable. HR sees the exact sentence that earned the score.

### 3. Cuemath Branding Pivot (Flat UI)
I intentionally moved away from generic "Glassmorphism" to match **Cuemath's specific brand identity**:
- High-contrast **Black & Yellow** palette (`#FFB800`).
- Geometric typography (**Poppins**).
- **Hard, 3px solid borders** and zero border-radius to match Cuemath's gamified EdTech aesthetic.

---

## 📈 Process Thinking: What Broke & Why
- **Multimodal Pipeline Optimization:** Ensuring base64 audio chunks were properly formatted for the model while maintaining low latency was a challenge. I had to standardize the frequency and encoding to prevent rejection.
- **Database Initialization:** During deployment, the backend initially "hung" because the database logic was defined but not correctly imported in the main entry point—a small but critical fix.
- **Resilient Session Recovery:** I implemented a system that synchronizes the interview transcript to `localStorage`. If a candidate refreshes mid-interview, the AI’s memory remains intact via JWT-linked persistence.

---

## 🔮 Future Roadmap (What's Next?)
- [ ] **Real-time VAD:** Implementing Voice Activity Detection so the candidate doesn't have to click a button to talk.
- [ ] **Streaming TTS:** Streaming the AI's response word-for-word to reduce perceived latency to near-zero.
- [ ] **HR Admin Panel:** A dashboard to sort candidates by "Simplicity" or "Clarity" scores.

---

## 🛠️ Local Setup
1. Clone the repo.
2. Run `npm install` in both `client/` and `server/` folders.
3. Add your `GEMINI_API_KEY`, `MONGO_URI`, and `SMTP_PASS` to `server/.env`.
4. Run `npm start` (Backend) and `npm run dev` (Frontend).

**Developed with ❤️ for the Cuemath AI Challenge.**
**Deadline: 13th April 2026**
