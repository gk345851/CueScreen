import { useState, useEffect } from 'react';

const STEPS = [
  'Reviewing your conversation…',
  'Analysing communication style…',
  'Scoring each dimension…',
  'Generating your report…',
];

export default function ProcessingScreen() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="screen" style={{ background: 'linear-gradient(145deg, #eef2ff 0%, #fafaf9 100%)' }}>
      <div className="card" style={{ textAlign: 'center' }}>
        <div className="brand" style={{ justifyContent: 'center' }}>
          <div className="brand-logo">C</div>
          <div className="brand-name">CueScreen</div>
        </div>

        <div className="processing-spinner" />

        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Analysing your interview</h2>
        <p style={{ color: 'var(--stone-500)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          This usually takes 15–20 seconds. Please don't close this tab.
        </p>

        <ul className="processing-steps">
          {STEPS.map((step, i) => {
            const state = i < stepIndex ? 'done' : i === stepIndex ? 'active' : '';
            return (
              <li
                key={step}
                className={`processing-step ${state}`}
              >
                <div className={`step-icon step-${state || 'pending'}`}>
                  {state === 'done' ? '✓' : state === 'active' ? '→' : '·'}
                </div>
                {step}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
