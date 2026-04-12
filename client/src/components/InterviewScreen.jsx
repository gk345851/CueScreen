import { useState, useEffect, useRef, useCallback } from 'react';
import { sendMessage, transcribeAudio } from '../utils/api';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useTTS } from '../hooks/useTTS';

const MAX_EXCHANGES = 4; // 1 initial + 4 follow-ups = 5 total questions

function ThinkingBubble() {
  return (
    <div className="bubble-row ai">
      <div className="bubble-avatar ai-avatar">A</div>
      <div className="bubble ai-bubble thinking-bubble">
        <div className="dot-pulse" />
        <div className="dot-pulse" />
        <div className="dot-pulse" />
      </div>
    </div>
  );
}

function ChatBubble({ role, content }) {
  const isAI = role === 'assistant';
  return (
    <div className={`bubble-row ${isAI ? 'ai' : 'user'}`}>
      {isAI && <div className="bubble-avatar ai-avatar">A</div>}
      <div className={`bubble ${isAI ? 'ai-bubble' : 'user-bubble'}`}>{content}</div>
      {!isAI && (
        <div className="bubble-avatar user-avatar" style={{ fontWeight: 700, fontSize: '0.7rem' }}>
          YOU
        </div>
      )}
    </div>
  );
}

export default function InterviewScreen({ candidateName, onComplete }) {
  const [messages, setMessages] = useState([]); // { role, content }[]
  const [status, setStatus] = useState('init'); // init | ai-thinking | ai-speaking | idle | recording | transcribing | error
  const [errorMsg, setErrorMsg] = useState('');
  const [exchangeCount, setExchangeCount] = useState(0);
  const [sessionSaved, setSessionSaved] = useState(false);

  const chatEndRef = useRef(null);
  const { isRecording, audioBlob, startRecording, stopRecording, reset } = useAudioRecorder();
  const { speak, isPlaying, stop: stopTTS } = useTTS();

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, status, scrollToBottom]);

  const initializedRef = useRef(false);

  // Restore session from localStorage
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const saved = localStorage.getItem('cuescreen_session');
    if (saved) {
      try {
        const { name, msgs } = JSON.parse(saved);
        if (name === candidateName && msgs?.length > 0) {
          setMessages(msgs);
          setExchangeCount(msgs.filter(m => m.role === 'user').length);
          setStatus('idle');
          setSessionSaved(true);
          return;
        }
      } catch {}
    }
    // Fresh start — kick off the interview
    initInterview();
  }, []);

  // Save session on every message change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('cuescreen_session', JSON.stringify({ name: candidateName, msgs: messages }));
    }
  }, [messages, candidateName]);

  // When audio blob is ready after stopping recording, transcribe it
  useEffect(() => {
    if (audioBlob) handleTranscribe(audioBlob);
  }, [audioBlob]);

  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 4000);
  };

  const initInterview = async () => {
    setStatus('ai-thinking');
    try {
      const { response, isComplete } = await sendMessage([], candidateName);
      const aiMsg = { role: 'assistant', content: response };
      setMessages([aiMsg]);
      setStatus('ai-speaking');
      await speak(response);
      if (isComplete) {
        finishInterview([aiMsg]);
      } else {
        setStatus('idle');
      }
    } catch (err) {
      console.error('Init API error:', err);
      showError('Failed to start interview. Please check API keys and restart the server.');
      setStatus('error');
    }
  };

  const handleTranscribe = async (blob) => {
    setStatus('transcribing');
    let transcript = '';

    // Reject very short blobs (silence / accidental clicks)
    if (blob.size < 2000) {
      showError("I didn't catch that — please try speaking again.");
      setStatus('idle');
      reset();
      return;
    }

    try {
      const result = await transcribeAudio(blob);
      transcript = result.transcript?.trim();
    } catch (err) {
      showError('Transcription failed. Please try again.');
      setStatus('idle');
      reset();
      return;
    }

    if (!transcript || transcript.length < 3) {
      showError("I didn't catch anything — please try again.");
      setStatus('idle');
      reset();
      return;
    }

    const userMsg = { role: 'user', content: transcript };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setExchangeCount((c) => c + 1);
    reset();

    // Get AI response
    await sendAIResponse(updated);
  };

  const sendAIResponse = async (currentMessages) => {
    setStatus('ai-thinking');
    try {
      const apiMessages = currentMessages.map((m) => ({ role: m.role, content: m.content }));
      const { response, isComplete } = await sendMessage(apiMessages, candidateName);

      const aiMsg = { role: 'assistant', content: response };
      const updated = [...currentMessages, aiMsg];
      setMessages(updated);
      setStatus('ai-speaking');
      await speak(response);

      if (isComplete || exchangeCount >= MAX_EXCHANGES) {
        finishInterview(updated);
      } else {
        setStatus('idle');
      }
    } catch (err) {
      console.error('sendAIResponse error:', err);
      showError('Failed to get AI response. Server might be down or key invalid.');
      setStatus('error');
    }
  };

  const finishInterview = (finalMessages) => {
    localStorage.removeItem('cuescreen_session');
    // Build transcript string for evaluator
    const transcript = finalMessages
      .map((m) => `${m.role === 'assistant' ? 'Aria' : 'Candidate'}: ${m.content}`)
      .join('\n\n');
    onComplete(transcript, finalMessages);
  };

  const handleRecord = () => {
    if (status !== 'idle') return;
    stopTTS(); // stop AI speaking if user jumps in
    startRecording();
    setStatus('recording');
  };

  const handleStopRecord = () => {
    stopRecording();
    // audioBlob useEffect will handle the rest
  };

  // Progress: count AI messages as "questions"
  const questionCount = messages.filter((m) => m.role === 'assistant').length;
  const progress = Math.min(questionCount, 5);
  const progressDots = Array.from({ length: 5 }, (_, i) => ({
    state: i < progress - 1 ? 'done' : i === progress - 1 ? 'active' : '',
  }));

  const isIdle = status === 'idle';
  const isRec = status === 'recording';

  return (
    <div className="interview-layout">
      {/* Header */}
      <div className="interview-header">
        <div className="brand" style={{ marginBottom: 0 }}>
          <div className="brand-logo">C</div>
          <div className="brand-name">CueScreen</div>
        </div>
        <div className="progress-pill">
          <div className="progress-dots">
            {progressDots.map((d, i) => (
              <div key={i} className={`progress-dot ${d.state}`} />
            ))}
          </div>
          <span>Q {Math.min(questionCount, 5)} / 5</span>
        </div>
      </div>

      {/* Chat */}
      <div className="chat-area">
        {sessionSaved && messages.length > 0 && (
          <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--stone-400)', padding: '0.25rem' }}>
            ↩ Session resumed
          </div>
        )}
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} content={m.content} />
        ))}
        {(status === 'ai-thinking' || status === 'transcribing') && <ThinkingBubble />}
        <div ref={chatEndRef} />
      </div>

      {/* Record Panel */}
      <div className="record-panel">
        {isPlaying ? (
          <div className="audio-playing-indicator">
            <div className="audio-bars">
              {[...Array(5)].map((_, i) => <div className="audio-bar" key={i} />)}
            </div>
            Aria is speaking…
          </div>
        ) : (
          <>
            <button
              id="record-btn"
              className={`record-btn ${isRec ? 'recording' : 'idle'}`}
              onClick={isRec ? handleStopRecord : handleRecord}
              disabled={!isIdle && !isRec}
              aria-label={isRec ? 'Stop recording' : 'Start recording'}
            >
              {isRec ? '⏹' : '🎙'}
            </button>
            <p className="record-hint">
              {isRec
                ? 'Recording… tap to stop'
                : status === 'transcribing'
                ? 'Transcribing…'
                : status === 'ai-thinking'
                ? 'Aria is thinking…'
                : status === 'init'
                ? 'Starting interview…'
                : 'Tap the mic to respond'}
            </p>
          </>
        )}
      </div>

      {/* Error toast */}
      {errorMsg && (
        <div className="error-toast" role="alert">
          ⚠️ {errorMsg}
        </div>
      )}
    </div>
  );
}
