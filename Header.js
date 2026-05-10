// ============================================================
//  MindSane — Header Component
// ============================================================

import React from 'react';

export default function Header({ avgMood }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div>
        <div style={{
          fontSize: 22, fontWeight: 800,
          background: 'linear-gradient(90deg, #a78bfa, #60efff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          🧠 MindSane
        </div>
        <div style={{ fontSize: 11, color: '#94a3b8', letterSpacing: 1 }}>
          YOUR AI MENTAL HEALTH COMPANION
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>Avg Mood</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#a78bfa' }}>
          {avgMood ? `${avgMood}/5` : '—'}
        </div>
      </div>
    </div>
  );
}
