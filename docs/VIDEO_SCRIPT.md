# Final Video Walkthrough Script (3–5 Minutes)

> **Pro-Tip:** Speak naturally. This is your project—show your passion for the engineering behind it. Fast-forward the middle of the interview in editing as planned.

---

## 1. The "Why" (45s)
**Visual:** Start with the Landing Page or the GitHub Repo.

"Hey everyone, I’m Gaurav. For the Cuemath challenge, I chose **Problem 3: The AI Tutor Screener**. While the Flashcard Engine and Social Media Studio were interesting, I felt this problem had the highest real-world impact. Cuemath's biggest scaling bottleneck is recruitment—finding tutors who don't just know math, but actually have the empathy and simplification skills to teach kids.

From an engineering perspective, building a real-time voice system that evaluates 'soft-skills' like patience and warmth is a much more nuanced challenge than processing PDFs or generating images. I wanted to see if I could build something that feels human, not robotic."

---

## 2. Navigating the Platform & Tech Stack (1m)
**Visual:** Quick tour of Login/Register, then land on the Dashboard.

"The platform is built on a **MERN stack** (MongoDB, Express, React, Node). I implemented a full **JWT-based authentication** system from the start because interview data is sensitive. 

Visually, I chose a **Flat UI design system** using Cuemath’s specific palette (#FFB800 Yellow/Black). I intentionally avoided generic 'glassmorphism' or heavy shadows. I wanted a clean, professional look that fits the Cuemath brand—sharp 2px borders and Poppins typography. It feels fresh and fast."

---

## 3. The Technical Edge: Multimodal Pipeline (45s)
**Visual:** Enter the interview screen. Click 'Start'.

"Now, here’s a key technical decision. Most people would use a three-step pipeline: Audio → Whisper (STT) → LLM → TTS. That creates huge latency and multiple points of failure.

Instead, I built a **Multimodal Pipeline** using **Gemini 2.5 Flash**. I’m streaming the raw base64 audio data directly to the model. It handles transcription and reasoning in a single pass. This massively reduces latency and, importantly for a startup-style project, it brought my infrastructure cost to zero on the free tier without sacrificing accuracy."

**[ACTION: Fast-forward the interview 3-5 seconds in your edit]**

"I'm fast-forwarding the middle part here, but notice how the AI (Aria) doesn't just ask a list of questions. It's programmed to role-play. It will pretend to be a confused student to see if I can explain fractions to a 9-year-old without getting frustrated."

---

## 4. The Result: Evidence-Based Assessment (1m)
**Visual:** Show the final Report Screen with the Radar Chart.

"Once the interview ends, we generate this report. We have an interactive **Radar Chart** built with Recharts, scoring the candidate on Clarity, Simplicity, Patience, Warmth, and Fluency.

But here is my 'Smart Choice' for this project: **The AI cannot give a score without a Receipt.** 

If you look here under 'Patience', the AI has pulled a **direct verbatim quote** from the transcript to justify that 9/10 score. This solves the LLM hallucination problem. An HR manager can look at this and immediately see the evidence for the grade. It makes the AI's assessment transparent and auditable."

---

## 5. Process Thinking & Future (30s)
**Visual:** Switch back to your face or a 'Summary' slide.

"In terms of process, I hit some interesting hurdles with **Multimodal Encoding**—standardizing the audio frequency so the model wouldn't reject the file took some trial and error. I also spent time building a **Resilient Session Recovery** system. If you refresh the page mid-interview, your transcript is saved in a JWT-linked state so you don't lose progress.

If I had more time, I’d add **Voice Activity Detection (VAD)** to remove the 'Click to Speak' button and make it a pure hands-free experience. 

That’s CueScreen. Thanks for watching!"
