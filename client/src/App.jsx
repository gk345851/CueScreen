import { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import InterviewScreen from './components/InterviewScreen';
import ProcessingScreen from './components/ProcessingScreen';
import ReportScreen from './components/ReportScreen';
import AuthScreen from './components/AuthScreen';
import { evaluateInterview } from './utils/api';
import './index.css';

// Screens: welcome | interview | processing | report
export default function App() {
  const [screen, setScreen] = useState('welcome');
  const [candidateName, setCandidateName] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([]);
  const [evalError, setEvalError] = useState('');
  const [authToken, setAuthToken] = useState(localStorage.getItem('cuescreen_jwt'));
  const [resetToken, setResetToken] = useState(null);

  // Check if there's a saved session on mount
  useEffect(() => {
    // Check URL for reset token
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('resetToken');
    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
      setScreen('auth'); // Ensure they are on auth screen to reset
      return;
    }

    if (!authToken) {
      setScreen('auth');
    }

    const saved = localStorage.getItem('cuescreen_session');
    if (saved && authToken) {
      try {
        const { name } = JSON.parse(saved);
        if (name) {
          setCandidateName(name);
        }
      } catch {}
    }
  }, [authToken]);

  const handleAuthSuccess = (token, user) => {
    localStorage.setItem('cuescreen_jwt', token);
    setAuthToken(token);
    setScreen('welcome');
  };

  const handleLogout = () => {
    localStorage.removeItem('cuescreen_jwt');
    setAuthToken(null);
    setScreen('auth');
  };

  const handleStart = (name) => {
    setCandidateName(name);
    setScreen('interview');
  };

  const handleInterviewComplete = async (transcriptStr, msgs) => {
    setTranscript(transcriptStr);
    setMessages(msgs);
    setScreen('processing');

    try {
      const result = await evaluateInterview(candidateName, transcriptStr);
      setEvaluation(result);
      setScreen('report');
    } catch (err) {
      console.error('Evaluation failed:', err);
      setEvalError('Evaluation failed — please try restarting the interview.');
      setScreen('welcome');
    }
  };

  const handleRestart = () => {
    localStorage.removeItem('cuescreen_session');
    setCandidateName('');
    setEvaluation(null);
    setTranscript('');
    setMessages([]);
    setEvalError('');
    setScreen('welcome');
  };

  return (
    <div className="app-container">
      {evalError && (
        <div className="error-toast" role="alert">⚠️ {evalError}</div>
      )}

      {/* Logout Button (if logged in) */}
      {authToken && screen !== 'interview' && screen !== 'processing' && (
        <button 
          onClick={handleLogout}
          className="btn btn-outline" 
          style={{ position: 'fixed', top: '1rem', right: '1.5rem', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
        >
          Logout
        </button>
      )}

      {screen === 'auth' && (
        <AuthScreen 
          onAuthSuccess={handleAuthSuccess} 
          initialMode={resetToken ? 'reset' : 'login'} 
          resetToken={resetToken} 
        />
      )}

      {screen === 'welcome' && (
        <WelcomeScreen onStart={handleStart} />
      )}

      {screen === 'interview' && (
        <InterviewScreen
          candidateName={candidateName}
          onComplete={handleInterviewComplete}
        />
      )}

      {screen === 'processing' && (
        <ProcessingScreen />
      )}

      {screen === 'report' && evaluation && (
        <ReportScreen
          candidateName={candidateName}
          evaluation={evaluation}
          transcript={transcript}
          messages={messages}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
