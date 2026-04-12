import React, { useState } from 'react';

export default function AuthScreen({ onAuthSuccess, initialMode = 'login', resetToken = null }) {
  const [mode, setMode] = useState(initialMode); // 'login', 'register', 'forgot', 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Use the env var or fallback for local dev
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      let endpoint = '';
      let body = {};

      if (mode === 'login') {
        endpoint = '/api/auth/login';
        body = { email, password };
      } else if (mode === 'register') {
        endpoint = '/api/auth/register';
        body = { email, password };
      } else if (mode === 'forgot') {
        endpoint = '/api/auth/forgot-password';
        body = { email };
      } else if (mode === 'reset') {
        endpoint = '/api/auth/reset-password';
        body = { token: resetToken, newPassword: password };
      }

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Request failed');
      }

      if (mode === 'login') {
        onAuthSuccess(data.token, data.user);
      } else if (mode === 'register') {
        setMessage('Registration successful! You can now log in.');
        setMode('login');
      } else if (mode === 'forgot') {
        setMessage(data.message);
      } else if (mode === 'reset') {
        setMessage('Password reset successful! You can now log in.');
        setMode('login');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-screen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card">
        <div className="brand" style={{ justifyContent: 'center' }}>
          <div className="brand-logo">C</div>
          <div>
            <div className="brand-name">CueScreen</div>
            <div className="brand-sub">Platform Login</div>
          </div>
        </div>

        <h2 className="section-title" style={{ textAlign: 'center' }}>
          {mode === 'login' && 'Sign In'}
          {mode === 'register' && 'Create Account'}
          {mode === 'forgot' && 'Reset Password'}
          {mode === 'reset' && 'Set New Password'}
        </h2>

        {error && <div style={{ color: 'var(--red-600)', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>}
        {message && <div style={{ color: 'var(--green-600)', marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>{message}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mode !== 'reset' && (
            <div className="input-group">
              <label className="input-label">Email</label>
              <input 
                type="email" 
                className="input-field" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          )}

          {mode !== 'forgot' && (
            <div className="input-group">
              <label className="input-label">{mode === 'reset' ? 'New Password' : 'Password'}</label>
              <input 
                type="password" 
                className="input-field" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Processing...' : (
              mode === 'login' ? 'Sign In' :
              mode === 'register' ? 'Register' :
              mode === 'forgot' ? 'Send Link' : 'Confirm Reset'
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {mode === 'login' && (
            <>
              <div>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setMode('register'); setError(''); setMessage(''); }} style={{ color: 'var(--cm-yellow-hover)' }}>Register</a></div>
              <div><a href="#" onClick={(e) => { e.preventDefault(); setMode('forgot'); setError(''); setMessage(''); }} style={{ color: 'var(--stone-500)' }}>Forgot password?</a></div>
            </>
          )}
          {mode === 'register' && (
            <div>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); setError(''); setMessage(''); }} style={{ color: 'var(--cm-yellow-hover)' }}>Sign In</a></div>
          )}
          {(mode === 'forgot' || mode === 'reset') && (
            <div><a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); setError(''); setMessage(''); }} style={{ color: 'var(--stone-500)' }}>Back to Login</a></div>
          )}
        </div>
      </div>
    </div>
  );
}
