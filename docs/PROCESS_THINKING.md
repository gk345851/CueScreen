# Process Thinking: The Evolution of CueScreen

## 1. Why Problem 3? (Choosing the AI Tutor Screener)
Out of the three challenges, I selected the **AI Tutor Screener** for two primary reasons:
- **Scaling Quality:** Cuemath's biggest bottleneck isn't content generation (Problem 2) or study tools (Problem 1), but the human-intensive process of vetting tutors. Automating this has the highest business ROI.
- **Technical Complexity:** Building a natural voice-based conversational AI that evaluates 'soft skills' (patience, warmth) is a multi-dimensional engineering challenge that goes beyond simple text-processing or image generation. It required a deep dive into multimodal LLM architectures and real-time audio handling.

## 2. What we tried first
Initial development focused on a generic "Glassmorphism" UI and a stateless interview flow. The assumption was that a simple, lightweight interface would suffice for a technical demonstration.

## 2. What broke & Why
- **Multimodal Pipeline Optimization:** Moving from a traditional STT -> LLM -> TTS stack to a multimodal Gemini pipeline was complex. We had to ensure the base64 audio chunks were properly formatted to avoid model rejection while maintaining low latency.
- **The "Hanging" Database:** During the shift to MongoDB, we encountered a bug where the backend would simply "hang" and not respond. This was traced back to a missing `require` statement in the main server entry point—the database logic existed but was never invoked.

## 3. Key Pivots & Smart Choices

### The "Gemini Multimodal" Pivot
To solve the $0 budget constraint, we investigated Gemini 2.5 Flash's multimodal capabilities. Instead of using a separate Transcription API (like Whisper) and a separate Reasoning API (like Claude), we collapsed the stack.
- **Decision:** Stream base64 audio directly to Gemini.
- **Tradeoff:** This slightly increased the payload size but removed **all latency** from the STT -> LLM relay and eliminated API costs.

### The Cuemath Branding Shift
Halfway through, we decided that "Delight" (as per the rubric) comes from feeling like a first-party product. We scrapped the glassmorphism and performed a complete CSS overhaul to the **Cuemath Flat UI**.
- **Decision:** Strict 2px solid borders, Poppins typography, and a #FFB800 (Cuemath Yellow) palette.

### Handling the "Messy Reality"
We implemented a **Resilient Session Recovery** system. By synchronizing the interview transcript to `localStorage` indexed by a JWT session, we ensured that even if a candidate refreshed their browser mid-interview, the AI’s memory would remain perfectly intact, preventing a poor candidate experience.

## 4. What would we do differently?
If we had more time:
1. **Real-time VAD:** We would implement **Web Audio API** based Voice Activity Detection so the candidate doesn't have to click a button to talk—making it feel even more like a human conversation.
2. **Streaming TTS:** Instead of waiting for the full MP3 buffer, we would stream the AI's voice response word-for-word to reduce the perceived latency to near-zero.
