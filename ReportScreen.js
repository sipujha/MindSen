// ============================================================
//  MindSane — Health Report Screen
// ============================================================

import React from 'react';

export default function ReportScreen({ avgMood, wellnessScore, moodBreakdown, topTags, onBack, onNavigate }) {
  const score = parseFloat(avgMood);

  const statusMsg = score >= 3.5
    ? '✅ You\'re doing well! Keep it up.'
    : score >= 2.5
    ? '⚠️ Average — some support may help.'
    : '🆘 Consider talking to a professional.';

  const statusColor = score >= 3.5 ? '#4ade80' : score >= 2.5 ? '#fbbf24' : '#EF5350';

  const tips = [
    { icon: '🧘', tip: 'Try Balasana daily for 5 minutes to manage stress',          color: '#4ade80' },
    { icon: '😴', tip: 'Maintain 7-8 hours sleep — it directly impacts mood',        color: '#60efff' },
    { icon: '🏃', tip: '30 min walk/jog boosts serotonin naturally',                 color: '#a78bfa' },
    { icon: '📱', tip: 'Reduce screen time 1hr before bed for better sleep',          color: '#fbbf24' },
    {
      icon: '👨‍⚕️',
      tip: score < 2.5
        ? 'Your mood score suggests talking to a therapist'
        : 'Keep logging daily for better insights',
      color: score < 2.5 ? '#EF5350' : '#4ade80',
    },
  ];

  return (
    <div style={{ paddingTop: 20 }}>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: 14, cursor: 'pointer', marginBottom: 16 }}
      >
        ← Back
      </button>

      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>📊 Health Report</div>
      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Aapki mental wellness summary</div>

      {/* Wellness score */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(96,239,255,0.1))',
        border: '1px solid rgba(167,139,250,0.3)',
        borderRadius: 20, padding: 20, marginBottom: 16, textAlign: 'center',
      }}>
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>WELLNESS SCORE</div>
        <div style={{
          fontSize: 56, fontWeight: 900,
          background: 'linear-gradient(135deg, #a78bfa, #60efff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          {wellnessScore}
        </div>
        <div style={{ fontSize: 14, color: '#94a3b8' }}>out of 100</div>
        <div style={{ marginTop: 12, fontSize: 13, color: statusColor }}>{statusMsg}</div>
      </div>

      {/* Mood breakdown */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: 16, marginBottom: 16,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 12 }}>MOOD BREAKDOWN</div>
        {moodBreakdown.map(mood => (
          <div key={mood.value} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ fontSize: 18, width: 28 }}>{mood.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{mood.label}</span>
                <span style={{ fontSize: 12, color: mood.color, fontWeight: 700 }}>{mood.pct}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${mood.pct}%`, height: '100%', background: mood.color, borderRadius: 3 }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Top triggers */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: 16, marginBottom: 16,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 12 }}>COMMON TRIGGERS</div>
        {topTags.map(([tag, count]) => (
          <div key={tag} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
            <span style={{ fontSize: 13, color: '#e8e8ff' }}>{tag}</span>
            <span style={{
              fontSize: 12, background: 'rgba(167,139,250,0.2)',
              color: '#a78bfa', borderRadius: 10, padding: '2px 10px', fontWeight: 700,
            }}>
              {count}x
            </span>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: 16, marginBottom: 16,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 12 }}>💡 PERSONALIZED TIPS</div>
        {tips.map((r, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12, padding: '10px 0',
            borderBottom: i < tips.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <div style={{ fontSize: 20 }}>{r.icon}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, flex: 1 }}>
              <span style={{ color: r.color, fontWeight: 700 }}>• </span>{r.tip}
            </div>
          </div>
        ))}
      </div>

      {/* Doctor alert */}
      {score < 2.5 && (
        <div style={{
          background: 'rgba(239,83,80,0.1)',
          border: '1px solid rgba(239,83,80,0.3)',
          borderRadius: 16, padding: 16, marginBottom: 16,
        }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#EF5350', marginBottom: 8 }}>
            👨‍⚕️ Professional Help Recommended
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
            Based on your mood patterns, speaking with a mental health professional could really help.
            Aap akele nahi hain — help lena bahut brave hai.
          </div>
          <button
            onClick={() => onNavigate('ai')}
            style={{
              marginTop: 12, background: '#EF5350', border: 'none',
              borderRadius: 10, padding: '10px 16px',
              color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer',
            }}
          >
            Chat with AI for Resources →
          </button>
        </div>
      )}
    </div>
  );
}
