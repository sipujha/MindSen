// ============================================================
//  MindSane — Mood Log Screen
// ============================================================

import React, { useState } from 'react';
import { MOODS, QUICK_TAGS } from '../constants';

export default function MoodLogScreen({ onSave, onBack }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote]                 = useState('');
  const [tags, setTags]                 = useState([]);

  const toggleTag = (tag) =>
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const handleSave = () => {
    if (!selectedMood) return;
    onSave(selectedMood, note, tags);
    setSelectedMood(null);
    setNote('');
    setTags([]);
  };

  return (
    <div style={{ paddingTop: 20 }}>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: 14, cursor: 'pointer', marginBottom: 16 }}
      >
        ← Back
      </button>

      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>How are you feeling?</div>
      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>Aaj ka mood kya hai? Log it honestly.</div>

      {/* Mood selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
        {MOODS.map(mood => {
          const active = selectedMood?.value === mood.value;
          return (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood)}
              style={{
                background: active ? `${mood.color}25` : 'rgba(255,255,255,0.04)',
                border: `2px solid ${active ? mood.color : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 16, padding: '14px 8px', cursor: 'pointer',
                transform: active ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: 28 }}>{mood.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: mood.color, marginTop: 6 }}>{mood.label}</div>
            </button>
          );
        })}
      </div>

      {/* Note */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 10 }}>WHAT'S ON YOUR MIND?</div>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Describe how you feel... kuch bhi likho."
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14, padding: 14,
            color: '#e8e8ff', fontSize: 14,
            minHeight: 90, resize: 'none', outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Tags */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', marginBottom: 10 }}>QUICK TAGS</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {QUICK_TAGS.map(tag => {
            const active = tags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                style={{
                  background: active ? 'rgba(167,139,250,0.25)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? '#a78bfa' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 20, padding: '6px 12px',
                  fontSize: 12, color: active ? '#a78bfa' : '#94a3b8',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={!selectedMood}
        style={{
          width: '100%',
          background: selectedMood
            ? 'linear-gradient(135deg, #a78bfa, #60efff)'
            : 'rgba(255,255,255,0.1)',
          border: 'none', borderRadius: 14, padding: '16px',
          color: selectedMood ? '#0f0c29' : '#475569',
          fontWeight: 800, fontSize: 16,
          cursor: selectedMood ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
        }}
      >
        Save Mood Log ✨
      </button>
    </div>
  );
}
