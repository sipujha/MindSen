// ============================================================
//  MindSane — Bottom Navigation Bar
// ============================================================

import React from 'react';

const NAV_ITEMS = [
  { icon: '🏠', label: 'Home',    screen: 'home'    },
  { icon: '📔', label: 'Log',     screen: 'log'     },
  { icon: '🤖', label: 'AI Chat', screen: 'ai'      },
  { icon: '🌬️', label: 'Breathe', screen: 'breathe' },
  { icon: '📊', label: 'Report',  screen: 'report'  },
];

export default function BottomNav({ current, onNavigate }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0,
      left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480,
      background: 'rgba(15,12,41,0.9)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      display: 'flex', justifyContent: 'space-around',
      padding: '10px 0 16px',
      zIndex: 100,
    }}>
      {NAV_ITEMS.map(nav => {
        const active = current === nav.screen;
        return (
          <button
            key={nav.screen}
            onClick={() => onNavigate(nav.screen)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4,
            }}
          >
            <div style={{
              fontSize: 20,
              opacity: active ? 1 : 0.4,
              transform: active ? 'scale(1.2)' : 'scale(1)',
              transition: 'all 0.2s',
            }}>
              {nav.icon}
            </div>
            <div style={{
              fontSize: 10,
              color: active ? '#a78bfa' : '#475569',
              fontWeight: active ? 800 : 400,
            }}>
              {nav.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
