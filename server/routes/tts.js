const express = require('express');
const router = express.Router();
const gTTS = require('gtts');
const fs = require('fs');
const path = require('path');

router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'text is required' });
    }

    const gtts = new gTTS(text, 'en');
    const tempFile = path.join(require('os').tmpdir(), `tts-${Date.now()}.mp3`);

    gtts.save(tempFile, function (err, result) {
      if(err) { throw err; }
      
      const buffer = fs.readFileSync(tempFile);
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length,
        'Cache-Control': 'no-cache',
      });
      res.send(buffer);
      
      try { fs.unlinkSync(tempFile); } catch (e) {}
    });

  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).json({ error: 'TTS failed', details: err.message });
  }
});

module.exports = router;
