// ============================================================
//  MindSane — Home Screen
// ============================================================

import React from 'react';
import { MOODS } from '../constants';

export default function HomeScreen({ moodLogs, avgMood, trend, onNavigate }) {
  const weekLogs = moodLogs.slice(0, 7);
  const todayLog = moodLogs[0] && new Date(moodLogs[0].date).toDateString() === new Date().toDateString()
    ? moodLogs[0] : null;

  const trendColor  = trend === 'up' ? '#4CAF50' : trend === 'down' ? '#EF5350' : '#64B5F6';
  const trendLabel  = trend === 'up' ? '↑ Better' : trend === 'down' ? '↓ Lower' : '→ Stable';

  return (
    <div>
      {/* Today card */}
      <div style={{
        margin: '20px 0 16px',
        background: 'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(96,239,255,0.08))',
        border: '1px solid rgba(167,139,250,0.2)',
        borderRadius: 20, padding: 20,
      }}>
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>
          TODAY — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        {todayLog ? (
          <div>
            <div style={{ fontSize: 40 }}>{todayLog.mood.emoji}</div>
            <div style={{ fontWeight: 700, color: todayLog.mood.color, fontSize: 18 }}>{todayLog.mood.label}</div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{todayLog.note}</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>
              You haven't logged your mood today
            </div>
            <button
              onClick={() => onNavigate('log')}
              style={{
                background: 'linear-gradient(135deg, #a78bfa, #60efff)',
                border: 'none', borderRadius: 12, padding: '10px 20px',
                color: '#0f0c29', fontWeight: 800, fontSize: 14, cursor: 'pointer',
              }}
            >
              + Log Mood Now
            </button>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { label: '7-Day Avg', value: weekLogs.length
              ? (weekLogs.reduce((s, l) => s + l.mood.value, 0) / weekLogs.length).toFixed(1)
              : '—', sub: '/5', icon: '📊' },
          { label: 'Trend',  value: trendLabel,  icon: '📈', color: trendColor },
          { label: 'Logs',   value: moodLogs.length, sub: ' total', icon: '📝' },
        ].map((s, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: '12px 10px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 18 }}>{s.icon}</div>
            <div style={{ fontWeight: 800, fontSize: 15, color: s.color || '#e8e8ff', marginTop: 4 }}>
              {s.value}{s.sub}
            </div>
            <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Mini bar chart */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, padding: 16, marginBottom: 16,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 12 }}>📈 MOOD HISTORY</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60 }}>
          {weekLogs.slice().reverse().map((log, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: '100%',
                background: log.mood.color,
                borderRadius: 4,
                height: `${((log.mood.value + 1) / 6) * 50}px`,
                opacity: 0.8,
              }} />
              <div style={{ fontSize: 9, color: '#64748b' }}>
                {new Date(log.date).toLocaleDateString('en', { weekday: 'short' }).slice(0, 2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 10 }}>QUICK ACTIONS</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[
          { icon: '🧘', label: 'Breathe',      sub: '4-7-8 Exercise',    screen: 'breathe' },
          { icon: '🤖', label: 'AI Chat',       sub: 'Get wellness advice',screen: 'ai'      },
          { icon: '📋', label: 'Health Report', sub: 'View your insights', screen: 'report'  },
          { icon: '📔', label: 'Mood Log',      sub: 'Track your mood',   screen: 'log'     },
        ].map((a, i) => (
          <button
            key={i}
            onClick={() => onNavigate(a.screen)}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16, padding: '16px 14px',
              textAlign: 'left', cursor: 'pointer',
              color: '#e8e8ff',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(167,139,250,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <div style={{ fontSize: 24, marginBottom: 6 }}>{a.icon}</div>
            <div style={{ fontWeight: 800, fontSize: 14 }}>{a.label}</div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{a.sub}</div>
          </button>
        ))}
      </div>

      {/* Recent logs */}
      <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 10 }}>RECENT LOGS</div>
      {moodLogs.slice(0, 3).map((log, i) => (
        <div key={i} style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14, padding: '12px 14px', marginBottom: 8,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ fontSize: 28 }}>{log.mood.emoji}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: log.mood.color, fontSize: 14 }}>{log.mood.label}</div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{log.note}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
              {log.tags.slice(0, 3).map(t => (
                <span key={t} style={{
                  fontSize: 10, background: 'rgba(167,139,250,0.15)',
                  color: '#a78bfa', borderRadius: 6, padding: '2px 7px',
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#475569' }}>
            {new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </div>
        </div>
      ))}
    </div>
  );
}
