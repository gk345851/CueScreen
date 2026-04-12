const express = require('express');
const router = express.Router();
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Store temp files in OS temp dir
const upload = multer({ dest: require('os').tmpdir() });

router.post('/', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file received' });
  }

  const tempPath = req.file.path;
  const renamedPath = tempPath + '.webm';

  try {
    fs.renameSync(tempPath, renamedPath);

    // Read audio as base64
    const audioBytes = fs.readFileSync(renamedPath).toString('base64');
    const mimeType = req.file.mimetype.split(';')[0] || 'audio/webm';

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = 'Transcribe exactly everything spoken in this audio. If nothing is spoken or there is just noise, return nothing. Do not add formatting like * or newlines unless spoken.';
    
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: audioBytes
        }
      },
      prompt
    ]);

    const transcript = result.response.text() || '';
    
    res.json({ transcript: transcript.trim() });
  } catch (err) {
    console.error('Transcription error:', err);
    res.status(500).json({ error: 'Transcription failed', details: err.message });
  } finally {
    // Clean up temp file
    try { fs.unlinkSync(renamedPath); } catch (_) {}
  }
});

module.exports = router;
