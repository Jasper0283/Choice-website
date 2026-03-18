'use client';

import { useMemo, useState } from 'react';
import { getRecommendations } from '../lib/recommender';

const QUESTIONS = [
  {
    key: 'age',
    label: 'Leeftijd',
    options: [
      { v: '4-6', label: '4–6' },
      { v: '7-9', label: '7–9' },
      { v: '10-13', label: '10–13' },
      { v: '14-17', label: '14–17' },
      { v: '18+', label: '18+' },
    ],
  },
  {
    key: 'budget',
    label: 'Budget',
    options: [
      { v: 'low', label: '< €25' },
      { v: 'mid', label: '€25–€60' },
      { v: 'high', label: '€60–€120' },
      { v: 'ultra', label: '€120+' },
    ],
  },
  {
    key: 'theme',
    label: 'Interesse',
    options: [
      { v: 'City', label: 'City' },
      { v: 'Technic', label: 'Technic' },
      { v: 'Star Wars', label: 'Star Wars' },
      { v: 'Creator', label: 'Creator 3-in-1' },
      { v: 'Icons', label: 'Icons (18+)' },
      { v: 'Friends', label: 'Friends' },
      { v: 'Harry Potter', label: 'Harry Potter' },
      { v: 'Speed Champions', label: 'Speed Champions' },
    ],
  },
  {
    key: 'goal',
    label: 'Waarvoor wil je de set vooral?',
    options: [
      { v: 'play', label: 'Spelen' },
      { v: 'display', label: 'Display' },
      { v: 'both', label: 'Beiden' },
    ],
  },
  {
    key: 'buildTime',
    label: 'Gewenste bouwtijd',
    options: [
      { v: 'short', label: 'Kort (< 1 uur)' },
      { v: 'medium', label: 'Gemiddeld (1–3 uur)' },
      { v: 'long', label: 'Lang (3+ uur)' },
    ],
  },
  {
    key: 'space',
    label: 'Beschikbare ruimte',
    options: [
      { v: 'small', label: 'Klein' },
      { v: 'medium', label: 'Normaal' },
      { v: 'large', label: 'Groot' },
    ],
  },
];

export default function DecisionForm() {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const progress = ((step) / QUESTIONS.length) * 100;

  const canNext = answers[QUESTIONS[step]?.key] !== undefined;

  const onChoose = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const onNext = () => {
    if (step < QUESTIONS.length - 1) setStep(s => s + 1);
    else setSubmitted(true);
  };

  const onPrev = () => setStep(s => Math.max(0, s - 1));
  const onRestart = () => { setAnswers({}); setStep(0); setSubmitted(false); };

  const results = useMemo(() => {
    if (!submitted) return null;
    return getRecommendations(answers, 3);
  }, [submitted, answers]);

  if (submitted) {
    return (
      <>
        <h2 className="q-title">Jouw aanbevelingen</h2>
        <div style={{ marginBottom: 12 }} className="progress"><div style={{ width: '100%' }} /></div>

        {results && results.items.length > 0 ? (
          <div className="result">
            {results.items.map((r, i) => (
              <div key={r.set.setNumber} className="result-item">
                <div className="kicker">#{i + 1}</div>
                <strong>{r.set.name}</strong> <span style={{ color: '#93a2b1' }}>({r.set.setNumber})</span>
                <div style={{ marginTop: 8 }}>
                  <span className="badge">🏷️ {r.set.theme}</span>
                  <span className="badge">💶 {budgetLabel(r.set.priceRange)}</span>
                  <span className="badge">🧱 ~{r.set.pieces} pcs</span>
                  <span className="badge">👤 {r.set.age}+ </span>
                </div>
                <p style={{ marginTop: 10, color: '#c9d7e8' }}>{r.reason}</p>
                {r.set.url ? (
                  <p style={{ marginTop: 8 }}>
                    <a href={r.set.url} target="_blank" rel="noreferrer">Bekijk set</a>
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p>Geen exacte match gevonden. Probeer je voorkeuren iets te verruimen (bijv. budget of bouwtijd).</p>
        )}

        <div className="actions">
          <button className="cta" onClick={onRestart}>Opnieuw kiezen</button>
        </div>
      </>
    );
  }

  const q = QUESTIONS[step];

  return (
    <>
      <div className="kicker">Stap {step + 1} van {QUESTIONS.length}</div>
      <div className="progress"><div style={{ width: `${progress}%` }} /></div>

      <h2 className="q-title" style={{ marginTop: 12 }}>{q.label}</h2>
      <div className="row">
        {q.options.map(opt => (
          <button
            key={opt.v}
            className={`btn ${answers[q.key] === opt.v ? 'active' : ''}`}
            onClick={() => onChoose(q.key, opt.v)}
            aria-pressed={answers[q.key] === opt.v}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="actions">
        <button className="btn secondary" onClick={onPrev} disabled={step === 0}>Vorige</button>
        <button className="cta" onClick={onNext} disabled={!canNext}>
          {step === QUESTIONS.length - 1 ? 'Toon resultaat' : 'Volgende'}
        </button>
      </div>
    </>
  );
}

function budgetLabel(range) {
  switch (range) {
    case 'low': return '< €25';
    case 'mid': return '€25–€60';
    case 'high': return '€60–€120';
    case 'ultra': return '€120+';
    default: return '€?';
  }
}