# CueScreen: AI-Powered Tutor Screening

CueScreen is an automated, voice-driven AI interviewing platform designed for screening Cuemath tutoring candidates. It conducts a 5-minute interactive voice interview to assess a candidate's soft skills, pedagogical intuition, and communication clarity. After the interview, it automatically generates an evidence-based evaluation report citing direct quotes from the candidate.

## 🚀 Architecture & Tech Stack

This project uses a separated frontend/backend architecture to ensure API keys are never exposed to the client.

*   **Frontend:** React + Vite (Vanilla CSS)
*   **Backend:** Node.js + Express
*   **AI Engine (Reasoning & Transcription):** Google Gemini 2.5 Flash
*   **Text-to-Speech (TTS):** gTTS (Google Translate API)
*   **Deployment:** Vercel (Frontend) & Railway (Backend)

## 💡 The "Cost Pivot" (Engineering Decision)

**Original Plan:** The initial architecture utilized **Anthropic Claude 3.5 Sonnet** for the interview loop, **OpenAI Whisper** for speech-to-text, and **OpenAI TTS (`nova`)** for voice generation. 

**The Challenge:** Both Anthropic and OpenAI require pre-purchased credits to operate, leaving the application unusable on `$0` budget free-tiers during the project deadline.

**The Pivot:** We executed a **100% Free Architecture Pivot** without compromising functionality:
1.  **Reasoning:** Migrated the interviewer and evaluator system prompts to `gemini-2.5-flash`, which offers a generous 1,500 daily request free tier.
2.  **Transcription:** Replaced OpenAI Whisper with Gemini's native multimodal audio understanding (passing base64 `.webm` chunks directly to the model).
3.  **Voice Output:** Replaced OpenAI's paid TTS with the NPM `gtts` wrapper, which buffers free MP3 files.

*This pivot demonstrated adaptability, API abstraction, and cost-aware engineering, dropping the interview cost from ~$0.15 to **$0.00**.*

## 🧠 Core Features & Implementations

### 1. Evidence-Based Evaluation
The evaluator prompt is strictly constrained to output JSON. More importantly, it requires **mandatory direct quotes** for every dimension scored (Clarity, Simplicity, Patience, Warmth, Fluency). 
*   **Why?** Without this, LLMs confidently hallucinate performance feedback. Quote-forcing makes every machine-made judgment auditable by an HR reviewer.

### 2. Strict Session Control (`MAX_EXCHANGES`)
Instead of using a rigid timer (which might cut a candidate off mid-thought), the conversation is strictly capped at **5 exchanges**.
*   **Why?** This prevents the AI from falling into an endless conversational loop and guarantees the screening takes exactly 4-5 minutes of real-world speaking time.

### 3. Progressive Audio MIME Detection
Different browsers support different audio codecs (`audio/webm;codecs=opus` on Chrome, `audio/mp4` on Safari). The `useAudioRecorder` hook uses progressive `.isTypeSupported()` detection to ensure the microphone records reliably across devices.

### 4. Resilient Session Recovery
Every interview transcript payload is saved to `localStorage` indexed by the candidate's name. If a candidate accidentally refreshes the page mid-interview, the UI restores the exact conversation state.

## 🐛 Notable Challenges Researched & Resolved

*   **React 18 Strict Mode Double-Mounts:** During local development, React mounts `useEffect` twice. This triggered the AI to fetch the "Hello" voice file twice simultaneously, resulting in queued, echoing audio. Solved via a `useRef` initialization guard.
*   **Gemini ChatSession Constraints:** Gemini's `startChat` helper strictly demands alternating `user` / `model` history formats. If a transcription glitch caused two consecutive `user` turns, the backend crashed. Solved by bypassing `startChat` and using `generateContent` with a manually formatted history array.
*   **Audio Blob Memory Leaks:** `URL.createObjectURL(blob)` calls are not automatically garbage collected by the browser. Failing to `URL.revokeObjectURL()` the TTS files caused memory bloat over a full session.

## 🔮 Future Enhancements (With more time/budget)
1.  **Real-Time Voice Activity Detection (VAD):** Replace the push-to-record button with automated silence detection.
2.  **ElevenLabs Voices:** Integrate premium, ultra-realistic voice models to enhance the candidate's conversational comfort.
3.  **Admin Dashboard:** Build a secure view for HR teams to sort reports by recommendation score and review audio replays synchronized to the transcript.
