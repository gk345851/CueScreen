# CueScreen — Video Walkthrough Script

> **Target length:** 3–4 minutes. Record in one take. Don't read this word-for-word — treat it as talking points.

---

## Opening (30s)
Start with the site open on the login page.

*"So I built CueScreen — an AI-powered tutor screener for Cuemath. The problem is real: they're hiring hundreds of tutors every month, and every single one goes through a 10-minute HR call just to check soft skills — communication, patience, how they explain things to kids. That's not scalable. So I automated it."*

*"Let me just walk you through it."*

---

## The Product (1 min)
Register or log in, then go to the interview screen.

*"When a candidate lands here, they get a brief intro and start a live voice conversation with Aria — that's the AI interviewer I built. It's not a form, not a quiz. It's an actual back-and-forth conversation."*

Start the interview. Record yourself answering a question naturally — something like "explain fractions to a 9-year-old."

*"Aria is designed to probe. If your answer is too short or vague, it'll follow up — exactly like a real interviewer would. It's also doing a role-play here — it's literally pretending to be a confused 9-year-old student to test whether you can actually simplify on the fly."*

After 2-3 exchanges, end the interview.

---

## The Report (45s)
Let the evaluation load and show the radar chart.

*"This is the output the HR team actually sees. Five dimensions — clarity, simplicity, patience, warmth, English fluency — scored on a radar graph. But here's the part I'm most happy with:"*

Point to a specific score with a quote underneath it.

*"Every single score is backed by a direct quote from the conversation. The AI cannot give a rating without pulling a verbatim line from what the candidate said. That was a deliberate prompt-engineering decision to prevent hallucination — because an HR person needs to be able to challenge that score, and they should have the receipts right there."*

---

## Key Technical Decisions (1 min)
Stay on the report screen or switch to a quick code view if comfortable.

*"The interesting design choice was the AI stack. The typical approach is: record audio → transcribe with Whisper → send text to an LLM → generate a response. Three API calls, three points of latency, three costs.*

*I collapsed that. The audio goes directly to Gemini 2.5 Flash as a multimodal input — it transcribes and reasons in the same call. Cut the latency, cut the cost to zero on the free tier."*

*"The trade-off was payload size — you're sending raw audio chunks base64-encoded over the wire — but for an interview tool where you're sending one response at a time, that's completely fine."*

---

## What I'd Build Next (30s)
*"If I had more time, the biggest thing I'd add is Voice Activity Detection — right now the candidate clicks a button to speak. In a real product, that friction kills the naturalistic feel of the conversation. VAD would make it feel much closer to an actual phone screen."*

*"I'd also add an HR dashboard — a view where Cuemath's team can filter candidates by score, see the full transcript, and one-click move them to the next round."*

---

## Close (15s)
*"That's CueScreen. It's live, it's deployed, and the repo is public. Thanks for watching."*
