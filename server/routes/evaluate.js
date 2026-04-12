const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { EVALUATOR_SYSTEM_PROMPT } = require('../prompts/evaluator');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { candidateName, transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: 'transcript is required' });
    }

    const userMessage = `Candidate Name: ${candidateName || 'Unknown'}

Interview Transcript:
${transcript}

Please evaluate this candidate and return ONLY a valid JSON object as specified.`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: EVALUATOR_SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: 'application/json', // Force JSON output — Gemini supports this natively
      },
    });

    const result = await model.generateContent(userMessage);
    const rawText = result.response.text().trim();

    let evaluation;
    try {
      evaluation = JSON.parse(rawText);
    } catch (parseErr) {
      console.error('JSON parse failed. Raw response:', rawText);
      return res.status(500).json({ error: 'AI returned invalid JSON', raw: rawText });
    }

    res.json(evaluation);
  } catch (err) {
    console.error('Evaluate route error:', err);
    res.status(500).json({ error: 'Evaluation failed', details: err.message });
  }
});

module.exports = router;
