# Process Thinking: The Evolution of CueScreen

This document outlines the engineering journey, the challenges encountered, and the key pivots made during the development of the AI Tutor Screener.

## 1. What we tried first
Initial development focused on a generic "Glassmorphism" UI and a stateless interview flow. The assumption was that a simple, lightweight interface would suffice for a technical demonstration.

## 2. What broke & Why
- **Identity & Persistence:** We quickly realized that a stateless app couldn't handle the "messy reality" of the internet. If a candidate refreshed their page or lost their connection, their interview progress vanished. 
- **Cost & Dependencies:** Our original blueprint relied on expensive OpenAI Whisper and Anthropic Claude APIs. On a development budget of $0, this created a hard barrier for testing and deployment.
- **The "Hanging" Database:** During the shift to MongoDB, we encountered a bug where the backend would simply "hang" and not respond. This was traced back to a missing `require` statement in the main server entry point—the database logic existed but was never invoked.

## 3. Key Pivots & Smart Choices

### The "Gemini Multimodal" Pivot
To solve the $0 budget constraint, we investigated Gemini 2.5 Flash's multimodal capabilities. Instead of using a separate Transcription API (like Whisper) and a separate Reasoning API (like Claude), we collapsed the stack.
- **Decision:** Stream base64 audio directly to Gemini.
- **Tradeoff:** This slightly increased the payload size but removed **all latency** from the STT -> LLM relay and eliminated API costs.

### The Cuemath Branding Shift
Halfway through, we decided that "Delight" (as per the rubric) comes from feeling like a first-party product. We scrapped the glassmorphism and performed a complete CSS overhaul to the **Cuemath Flat UI**.
- **Decision:** Strict 2px solid borders, Poppins typography, and a #FFB800 (Cuemath Yellow) palette.

### Authenticated vs. Anonymous Flow
We moved from a simple name-entry "Welcome Screen" to a full **JWT-authenticated portal**. 
- **Reasoning:** Interview data is sensitive. By adding MongoDB authentication and a "Forgot Password" flow via Nodemailer, we demonstrated a "Security-First" mindset rather than just building a toy.

## 4. What would we do differently?
If we had more time:
1. **Real-time VAD:** We would implement **Web Audio API** based Voice Activity Detection so the candidate doesn't have to click a button to talk—making it feel even more like a human conversation.
2. **Streaming TTS:** Instead of waiting for the full MP3 buffer, we would stream the AI's voice response word-for-word to reduce the perceived latency to near-zero.
