const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { INTERVIEWER_SYSTEM_PROMPT } = require('../prompts/interviewer');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { messages, candidateName } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const systemPrompt = INTERVIEWER_SYSTEM_PROMPT.replace('[name]', candidateName || 'there');

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
    });

    // Convert messages to Gemini format: role must be 'user' or 'model'
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // If it's empty, we inject a starter message so it doesn't crash
    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: 'Hello, I am ready to begin.' }] });
    }

    const result = await model.generateContent({ contents });
    const text = result.response.text();

    const isComplete = text.includes('INTERVIEW_COMPLETE');
    const cleanedText = text.replace('INTERVIEW_COMPLETE', '').trim();

    res.json({ response: cleanedText, isComplete });
  } catch (err) {
    console.error('Interview route error:', err);
    res.status(500).json({ error: 'Failed to get AI response', details: err.message });
  }
});

module.exports = router;
