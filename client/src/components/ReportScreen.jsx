import { useState } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const BADGE_CONFIG = {
  Proceed: { cls: 'badge-proceed', icon: '✅', label: 'Proceed to Next Round' },
  Hold:    { cls: 'badge-hold',    icon: '⏸', label: 'Hold for Review' },
  Decline: { cls: 'badge-decline', icon: '❌', label: 'Not Recommended' },
};

function getScoreClass(score) {
  if (score === null || score === undefined) return '';
  if (score >= 7) return 'score-high';
  if (score >= 5) return 'score-medium';
  return 'score-low';
}

function getFillClass(score) {
  if (score === null || score === undefined) return 'fill-medium';
  if (score >= 7) return 'fill-high';
  if (score >= 5) return 'fill-medium';
  return 'fill-low';
}

function DimensionCard({ dim }) {
  const score = dim.score;
  return (
    <div className={`dimension-card ${getScoreClass(score)}`}>
      <div className="dimension-top">
        <div className="dimension-name">{dim.dimension}</div>
        <div className="dimension-score">
          {score !== null && score !== undefined ? score : '—'}
          <span> / 10</span>
        </div>
      </div>
      <div className="score-bar-track">
        <div
          className={`score-bar-fill ${getFillClass(score)}`}
          style={{ width: `${((score ?? 0) / 10) * 100}%` }}
        />
      </div>
      <div className="dimension-reasoning">{dim.reasoning}</div>
      {dim.quote && (
        <div className="dimension-quote">"{dim.quote}"</div>
      )}
    </div>
  );
}

function TranscriptSection({ fullTranscript, messages }) {
  const [open, setOpen] = useState(false);

  // Prefer structured messages if available
  const lines = messages
    ? messages.map((m) => ({
        speaker: m.role === 'assistant' ? 'Aria' : 'Candidate',
        content: m.content,
        isAI: m.role === 'assistant',
      }))
    : fullTranscript.split('\n\n').map((line) => {
        const isAI = line.startsWith('Aria:');
        return {
          speaker: isAI ? 'Aria' : 'Candidate',
          content: line.replace(/^(Aria|Candidate): /, ''),
          isAI,
        };
      });

  return (
    <div className="transcript-section">
      <button
        className="transcript-toggle"
        onClick={() => setOpen((v) => !v)}
        id="transcript-toggle-btn"
      >
        <span>Full Transcript</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="transcript-body">
          {lines.map((line, i) => (
            <div className="transcript-line" key={i}>
              <div className={`transcript-speaker ${line.isAI ? 'speaker-ai' : 'speaker-user'}`}>
                {line.speaker}
              </div>
              <div>{line.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ReportScreen({ candidateName, evaluation, transcript, messages, onRestart }) {
  const badge = BADGE_CONFIG[evaluation.recommendation] || BADGE_CONFIG.Hold;
  const interviewDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  // Build radar data
  const radarData = (evaluation.scores || []).map((d) => ({
    subject: d.dimension,
    score: d.score ?? 0,
    fullMark: 10,
  }));

  const handlePrint = () => window.print();

  const handleDownload = () => {
    // Build a clean text report
    const lines = [
      `CUESCREEN INTERVIEW REPORT`,
      `${'─'.repeat(40)}`,
      `Candidate: ${candidateName}`,
      `Date: ${interviewDate}`,
      `Recommendation: ${evaluation.recommendation}`,
      `Overall Score: ${evaluation.overallScore ?? 'N/A'}/10`,
      ``,
      `SUMMARY`,
      evaluation.justification,
      ``,
      `DIMENSION SCORES`,
      ...(evaluation.scores || []).map(
        (d) =>
          `• ${d.dimension}: ${d.score ?? 'N/A'}/10\n  ${d.reasoning}\n  "${d.quote}"`
      ),
      ``,
      `TRANSCRIPT`,
      ...(messages || []).map(
        (m) => `${m.role === 'assistant' ? 'Aria' : 'Candidate'}: ${m.content}`
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CueScreen_${candidateName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="report-screen">
      <div className="report-container">
        {/* Header */}
        <div className="report-header">
          <div className="brand" style={{ justifyContent: 'center' }}>
            <div className="brand-logo">C</div>
            <div>
              <div className="brand-name">CueScreen</div>
              <div className="brand-sub">Interview Evaluation Report</div>
            </div>
          </div>
          <h1 style={{ fontSize: '1.6rem', marginTop: '1rem' }}>{candidateName}</h1>
          <div className="report-meta">Interview conducted {interviewDate}</div>

          {/* Recommendation badge */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '1.25rem 0' }}>
            <div className={`recommendation-badge ${badge.cls}`} id="recommendation-badge">
              {badge.icon} &nbsp; {badge.label}
            </div>
          </div>

          <p className="justification-text">{evaluation.justification}</p>
        </div>

        {/* Overall score + Radar */}
        <div className="radar-container">
          <div className="section-title">Performance Overview</div>
          {evaluation.overallScore !== undefined && (
            <div className="overall-score">
              <div
                className="score-circle"
                style={{ '--pct': `${((evaluation.overallScore / 10) * 100).toFixed(0)}%` }}
              >
                <div className="score-circle-inner">
                  <div className="score-circle-value">{evaluation.overallScore}</div>
                  <div className="score-circle-label">/ 10</div>
                </div>
              </div>
            </div>
          )}
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--stone-200)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontFamily: 'Poppins', fontSize: 12, fill: 'var(--stone-700)' }}
              />
              <Tooltip
                contentStyle={{
                  fontFamily: 'Poppins',
                  fontSize: 12,
                  borderRadius: 8,
                  border: '1px solid var(--stone-200)',
                }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="var(--cm-black)"
                fill="var(--cm-yellow)"
                fillOpacity={0.6}
                dot={{ r: 4, fill: 'var(--cm-black)' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Dimension cards */}
        <div className="section-title" style={{ marginBottom: '0.75rem' }}>Dimension Breakdown</div>
        <div className="dimension-grid">
          {(evaluation.scores || []).map((dim) => (
            <DimensionCard key={dim.dimension} dim={dim} />
          ))}
        </div>

        {/* Transcript */}
        <TranscriptSection fullTranscript={transcript} messages={messages} />

        {/* Actions */}
        <div className="report-actions">
          <button className="btn btn-primary" onClick={handleDownload} id="download-report-btn">
            ⬇ Download Report
          </button>
          <button className="btn btn-secondary" onClick={handlePrint} id="print-report-btn">
            🖨 Print
          </button>
          <button className="btn btn-outline" onClick={onRestart} id="new-interview-btn">
            ↺ New Interview
          </button>
        </div>
      </div>
    </div>
  );
}
