import { useState } from 'react';

const FEATURES = [
  { icon: '🎙️', text: '~5 minute voice conversation' },
  { icon: '💬', text: 'No trick questions — just talk naturally' },
  { icon: '📊', text: "You'll receive a detailed feedback report at the end" },
];

export default function WelcomeScreen({ onStart }) {
  const [name, setName] = useState('');
  const [micStatus, setMicStatus] = useState('idle'); // idle | pending | granted | denied
  const [micStream, setMicStream] = useState(null);

  const requestMic = async () => {
    setMicStatus('pending');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);
      setMicStatus('granted');
    } catch {
      setMicStatus('denied');
    }
  };

  const handleStart = () => {
    // Release mic stream — InterviewScreen will request its own
    if (micStream) micStream.getTracks().forEach((t) => t.stop());
    onStart(name.trim());
  };

  const canStart = name.trim().length >= 2 && micStatus === 'granted';

  return (
    <div className="screen" style={{ background: 'linear-gradient(145deg, #eef2ff 0%, #fafaf9 50%, #fef9c3 100%)' }}>
      <div className="card">
        {/* Brand */}
        <div className="brand">
          <div className="brand-logo">C</div>
          <div>
            <div className="brand-name">CueScreen</div>
            <div className="brand-sub">Cuemath Tutor Screening</div>
          </div>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', lineHeight: 1.2, marginBottom: '0.5rem' }}>
          Welcome to your screening interview
        </h1>
        <p style={{ color: 'var(--stone-600)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          You'll have a short voice conversation with our AI interviewer, Aria. She'll ask about your teaching style — no math tests, just a conversation about how you connect with students.
        </p>

        {/* Features */}
        <div className="welcome-features">
          {FEATURES.map((f) => (
            <div className="welcome-feature" key={f.text}>
              <div className="feature-icon">{f.icon}</div>
              <span>{f.text}</span>
            </div>
          ))}
        </div>

        <div className="divider" />

        {/* Name input */}
        <div className="input-group" style={{ marginBottom: '1rem' }}>
          <label className="input-label" htmlFor="candidate-name">Your full name</label>
          <input
            id="candidate-name"
            className="input-field"
            type="text"
            placeholder="e.g. Priya Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && micStatus !== 'granted' && requestMic()}
            autoComplete="name"
          />
        </div>

        {/* Mic permission */}
        {micStatus === 'idle' && (
          <button
            className="btn btn-outline"
            style={{ width: '100%', marginBottom: '1rem' }}
            onClick={requestMic}
            disabled={name.trim().length < 2}
            id="request-mic-btn"
          >
            🎙️ &nbsp;Allow microphone access
          </button>
        )}

        {micStatus === 'pending' && (
          <div className="mic-status pending">⏳ Waiting for microphone permission…</div>
        )}

        {micStatus === 'granted' && (
          <div className="mic-status granted" style={{ marginBottom: '1rem' }}>
            ✅ Microphone ready
          </div>
        )}

        {micStatus === 'denied' && (
          <div className="mic-status denied" style={{ marginBottom: '1rem' }}>
            ❌ Microphone access denied — please enable it in your browser settings and refresh.
          </div>
        )}

        {/* Start */}
        <button
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: '0.5rem' }}
          onClick={handleStart}
          disabled={!canStart}
          id="start-interview-btn"
        >
          Begin Interview →
        </button>

        <p style={{ fontSize: '0.75rem', color: 'var(--stone-400)', textAlign: 'center', marginTop: '1rem' }}>
          Your responses are processed securely and used only for this screening.
        </p>
      </div>
    </div>
  );
}
