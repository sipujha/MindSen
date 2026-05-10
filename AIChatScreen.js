// ============================================================
//  MindSane — AI Chat Screen
//  Powered by Anthropic Claude API
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToAI } from '../api';

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: "Namaste! 🙏 I'm your MindSane AI companion. Tell me how you're feeling today — your mood, any stress, sleep, or anything on your mind. I'll give you a personalized wellness plan with yoga, exercises, or suggest if you need professional help.",
};

const QUICK_PROMPTS = [
  'I feel anxious 😰',
  'Help me sleep better 😴',
  "I'm very stressed 😓",
  'Suggest yoga for me 🧘',
  'Do I need a doctor? 👨‍⚕️',
];

export default function AIChatScreen({ moodLogs, onBack }) {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const chatEndRef               = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const reply = await sendMessageToAI(messages, msg, moodLogs);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Connection issue. Please try again. You're not alone! 💙" },
      ]);
    }
    setLoading(false);
  };

  return (
    <div style={{ paddingTop: 20, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: 14, cursor: 'pointer' }}>←</button>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16 }}>🤖 MindSane AI</div>
          <div style={{ fontSize: 11, color: '#4CAF50' }}>● Online — Ready to help</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'assistant' && (
              <div style={{ fontSize: 24, marginRight: 8, flexShrink: 0 }}>🧠</div>
            )}
            <div style={{
              maxWidth: '82%', padding: '12px 14px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, #a78bfa, #7c3aed)'
                : 'rgba(255,255,255,0.06)',
              border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.08)' : 'none',
              fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap', color: '#e8e8ff',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 24 }}>🧠</div>
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '18px 18px 18px 4px',
              padding: '12px 16px', fontSize: 20, color: '#a78bfa',
            }}>
              ● ● ●
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick prompts */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 8 }}>
        {QUICK_PROMPTS.map(p => (
          <button
            key={p}
            onClick={() => send(p)}
            style={{
              flexShrink: 0,
              background: 'rgba(167,139,250,0.1)',
              border: '1px solid rgba(167,139,250,0.3)',
              borderRadius: 20, padding: '6px 12px',
              fontSize: 11, color: '#a78bfa', cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Apna haal batao... I'm listening 💙"
          style={{
            flex: 1, background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 14, padding: '12px 14px',
            color: '#e8e8ff', fontSize: 13, outline: 'none',
          }}
        />
        <button
          onClick={() => send()}
          disabled={loading}
          style={{
            background: 'linear-gradient(135deg, #a78bfa, #60efff)',
            border: 'none', borderRadius: 14, padding: '12px 16px',
            color: '#0f0c29', fontWeight: 800, fontSize: 16, cursor: 'pointer',
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}
