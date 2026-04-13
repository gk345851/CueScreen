# Final Balanced Video Walkthrough Script (3 Minutes)

> **The Balance:** Lead with the product, but explain the "why" behind the tech as you show it. 

---

## 1. The Hook (20s)
**Visual:** Start on the Landing Page.

"Hey everyone, I’m Gaurav. For the Cuemath challenge, I built **CueScreen**. The problem is simple: scaling tutor recruitment is a massive human bottleneck. I wanted to build an AI that doesn't just 'test' tutors, but actually converses with them to find the soft skills that matter—patience, warmth, and the ability to simplify."

---

## 2. Tour & Branding Choice (30s)
**Visual:** Quick tour of Login/Dashboard.

"I went with a **Neo-brutalist Flat UI** to match Cuemath’s specific brand identity—sharp 3px borders and high-contrast yellow. Under the hood, we’re using a **MERN stack** with full **JWT authentication** to keep candidate data and interview transcripts secure from day one."

---

## 3. The Tech Edge: Multimodal Pipeline (45s)
**Visual:** Click 'Begin' and start talking to Aria.

"Now, the 'secret sauce' here is the **Multimodal Pipeline**. Instead of the slow 'Audio → Text → LLM' loop, I’m streaming raw audio directly into **Gemini 2.5 Flash**. 

**[ACTION: Fast-forward 3s in edit]**

This makes the interaction feel low-latency and natural. Notice how Aria actually role-plays? She’s pretending to be a confused 9-year-old right now to see if I can explain fractions without getting frustrated. It’s testing my temperament, not just my knowledge."

---

## 4. Smart Decisions: Evidence-Based Scoring (45s)
**Visual:** Show the Report Screen.

"Once we're done, we get this radar analysis. But here’s the key engineering decision: **Auditability**. 

The AI isn't allowed to give a score without a 'Receipt.' If you look under 'Simplicity,' it has pulled a **direct verbatim quote** from my transcript to justify its grade. This prevents LLM hallucination and gives the HR team concrete evidence to review."

---

## 5. Robustness & Future (20s)
**Visual:** Show the 'Final' screen or your face.

"I also built in **Resilient Session Recovery** so candidates don't lose their place on a refresh. If I had more time, I’d add **Voice Activity Detection** to make it completely hands-free. 

That’s CueScreen—automated, evidence-based screening for the next generation of tutors. Thanks!"
