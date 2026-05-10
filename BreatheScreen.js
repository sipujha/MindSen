// ============================================================
//  MindSane — Breathe / Yoga Screen
// ============================================================

import React from 'react';
import { YOGA_POSES } from '../constants';
import { useBreathe } from '../hooks/useBreathe';

const PHASE_COLORS = {
  inhale: '#60efff',
  hold:   '#a78bfa',
  exhale: '#4ade80',
};

const PHASE_LABELS = {
  inhale: { label: 'Inhale',  sub: '4 seconds', emoji: '😮‍💨' },
  hold:   { label: 'Hold',    sub: '7 seconds', emoji: '😶'   },
  exhale: { label: 'Exhale',  sub: '8 seconds', emoji: '😮'   },
};

export default function BreatheScreen({ onBack }) {
  const { active, phase, round, totalRounds, start, stop } = useBreathe();
  const color  = active ? PHASE_COLORS[phase] : 'rgba(255,255,255,0.2)';
  const info   = PHASE_LABELS[phase] || PHASE_LABELS.inhale;

  return (
    <div style={{ paddingTop: 20, textAlign: 'center' }}>
      <button
        onClick={() => { stop(); onBack(); }}
        style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: 14, cursor: 'pointer', display: 'block', marginBottom: 20 }}
      >
        ← Back
      </button>

      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>🌬️ Breathe with Me</div>
      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 40 }}>4-7-8 Breathing — Anxiety ke liye best</div>

      {/* Animated circle */}
      <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 40px' }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: '50%',
          background: active
            ? `radial-gradient(circle, ${color}66, ${color}1a)`
            : 'radial-gradient(circle, rgba(255,255,255,0.1), transparent)',
          border: `3px solid ${color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
          transition: 'all 1s ease',
          transform: active && phase === 'inhale' ? 'scale(1.15)'
                   : active && phase === 'exhale' ? 'scale(0.9)'
                   : 'scale(1)',
        }}>
          <div style={{ fontSize: 36 }}>{active ? info.emoji : '🫁'}</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#e8e8ff', marginTop: 8, textTransform: 'uppercase', letterSpacing: 2 }}>
            {active ? info.label : 'Ready'}
          </div>
          {active && (
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{info.sub}</div>
          )}
        </div>
      </div>

      {/* Round dots */}
      {active && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: '#94a3b8' }}>Round {round + 1} of {totalRounds}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 8 }}>
            {Array.from({ length: totalRounds }).map((_, r) => (
              <div key={r} style={{
                width: 10, height: 10, borderRadius: '50%',
                background: r < round ? '#4ade80' : r === round ? '#a78bfa' : 'rgba(255,255,255,0.1)',
              }} />
            ))}
          </div>
        </div>
      )}

      {!active && (
        <button
          onClick={start}
          style={{
            background: 'linear-gradient(135deg, #a78bfa, #60efff)',
            border: 'none', borderRadius: 14, padding: '16px 40px',
            color: '#0f0c29', fontWeight: 800, fontSize: 16, cursor: 'pointer',
          }}
        >
          Start Breathing
        </button>
      )}

      {/* Yoga guide */}
      <div style={{
        marginTop: 40,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: 16, textAlign: 'left',
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 10 }}>🧘 YOGA FOR MENTAL HEALTH</div>
        {YOGA_POSES.map((y, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '10px 0',
            borderBottom: i < YOGA_POSES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e8e8ff' }}>{y.pose}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{y.benefit}</div>
            </div>
            <div style={{ fontSize: 11, color: '#a78bfa', fontWeight: 700 }}>{y.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
