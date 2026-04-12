const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Send a message and get the AI interviewer's response
export async function sendMessage(messages, candidateName) {
  const res = await fetch(`${API_BASE}/api/interview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, candidateName }),
  });
  if (!res.ok) throw new Error(`Interview API error: ${res.status}`);
  return res.json(); // { response, isComplete }
}

// Transcribe audio blob using Whisper
export async function transcribeAudio(audioBlob) {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');

  const res = await fetch(`${API_BASE}/api/transcribe`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(`Transcription API error: ${res.status}`);
  return res.json(); // { transcript }
}

// Evaluate the full interview transcript
export async function evaluateInterview(candidateName, transcript) {
  const res = await fetch(`${API_BASE}/api/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidateName, transcript }),
  });
  if (!res.ok) throw new Error(`Evaluation API error: ${res.status}`);
  return res.json();
}

// Get TTS audio as a blob URL
export async function speakText(text) {
  const res = await fetch(`${API_BASE}/api/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice: 'nova' }),
  });
  if (!res.ok) throw new Error(`TTS API error: ${res.status}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
