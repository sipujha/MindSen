// ============================================================
//  MindSane — Main Component
//  Orchestrates screens, navigation, and shared state
// ============================================================

import React, { useState } from 'react';
import Header      from './components/Header';
import BottomNav   from './components/BottomNav';
import HomeScreen  from './screens/HomeScreen';
import MoodLogScreen from './screens/MoodLogScreen';
import AIChatScreen  from './screens/AIChatScreen';
import BreatheScreen from './screens/BreatheScreen';
import ReportScreen  from './screens/ReportScreen';
import { useMoodLogs } from './hooks/useMoodLogs';

export default function MindSane() {
  const [screen, setScreen] = useState('home');
  const {
    moodLogs, addLog,
    avgMood, wellnessScore,
    trend, moodBreakdown, topTags,
  } = useMoodLogs();

  const navigate = (s) => setScreen(s);

  return (
    <div style={{
      fontFamily: "'Nunito', 'Segoe UI', sans-serif",
      background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a3e 40%, #0f2027 100%)',
      minHeight: '100vh',
      color: '#e8e8ff',
      maxWidth: 480,
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient background orbs */}
      <div style={{
        position: 'fixed', top: -80, right: -80,
        width: 250, height: 250, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(130,80,255,0.15) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: 100, left: -60,
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,210,255,0.1) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <Header avgMood={avgMood} />

      <div style={{ padding: '0 16px 100px', position: 'relative', zIndex: 1 }}>

        {screen === 'home' && (
          <HomeScreen
            moodLogs={moodLogs}
            avgMood={avgMood}
            trend={trend}
            onNavigate={navigate}
          />
        )}

        {screen === 'log' && (
          <MoodLogScreen
            onSave={(mood, note, tags) => { addLog(mood, note, tags); navigate('home'); }}
            onBack={() => navigate('home')}
          />
        )}

        {screen === 'ai' && (
          <AIChatScreen
            moodLogs={moodLogs}
            onBack={() => navigate('home')}
          />
        )}

        {screen === 'breathe' && (
          <BreatheScreen onBack={() => navigate('home')} />
        )}

        {screen === 'report' && (
          <ReportScreen
            avgMood={avgMood}
            wellnessScore={wellnessScore}
            moodBreakdown={moodBreakdown}
            topTags={topTags}
            onBack={() => navigate('home')}
            onNavigate={navigate}
          />
        )}
      </div>

      <BottomNav current={screen} onNavigate={navigate} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        @keyframes pulse { 0%,100% { opacity:0.3; } 50% { opacity:1; } }
      `}</style>
    </div>
  );
}
