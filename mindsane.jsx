import { useState, useEffect, useRef } from "react";

const MOODS = [
  { emoji: "😄", label: "Euphoric", value: 5, color: "#FFD700" },
  { emoji: "😊", label: "Happy", value: 4, color: "#4CAF50" },
  { emoji: "😐", label: "Neutral", value: 3, color: "#64B5F6" },
  { emoji: "😔", label: "Sad", value: 2, color: "#9575CD" },
  { emoji: "😰", label: "Anxious", value: 1, color: "#EF5350" },
  { emoji: "😡", label: "Angry", value: 0, color: "#F44336" },
];

const QUICK_TAGS = [
  "Work stress", "Family time", "Exercise", "Poor sleep", "Good meal",
  "Social anxiety", "Meditation", "Creative", "Lonely", "Grateful",
  "Overwhelmed", "Energetic", "Tired", "Focused", "Distracted"
];

export default function MindSane() {
  const [screen, setScreen] = useState("home");
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodNote, setMoodNote] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [moodLogs, setMoodLogs] = useState([
    { mood: MOODS[1], note: "Feeling productive today", tags: ["Exercise", "Focused"], date: new Date(Date.now() - 86400000) },
    { mood: MOODS[2], note: "Just an average day", tags: ["Work stress"], date: new Date(Date.now() - 172800000) },
    { mood: MOODS[0], note: "Had a great workout!", tags: ["Exercise", "Energetic"], date: new Date(Date.now() - 259200000) },
    { mood: MOODS[4], note: "Feeling overwhelmed with deadlines", tags: ["Work stress", "Poor sleep"], date: new Date(Date.now() - 345600000) },
    { mood: MOODS[1], note: "Meditated for 20 mins", tags: ["Meditation", "Grateful"], date: new Date(Date.now() - 432000000) },
  ]);
  const [aiMessages, setAiMessages] = useState([
    { role: "assistant", content: "Namaste! 🙏 I'm your MindSane AI companion. Tell me how you're feeling today — your mood, any stress, sleep, or anything on your mind. I'll give you a personalized wellness plan with yoga, exercises, or suggest if you need professional help." }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const chatEndRef = useRef(null);
  const [breatheActive, setBreatheActive] = useState(false);
  const [breathePhase, setBreathePhase] = useState("inhale");
  const [breatheCount, setBreatheCount] = useState(0);
  const breatheInterval = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

  const logMood = () => {
    if (!selectedMood) return;
    const newLog = { mood: selectedMood, note: moodNote, tags: selectedTags, date: new Date() };
    setMoodLogs(prev => [newLog, ...prev]);
    setSelectedMood(null);
    setMoodNote("");
    setSelectedTags([]);
    setScreen("home");
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const avgMood = moodLogs.length ? (moodLogs.reduce((s, l) => s + l.mood.value, 0) / moodLogs.length).toFixed(1) : "—";
  const weekLogs = moodLogs.slice(0, 7);

  const sendToAI = async () => {
    if (!aiInput.trim() || aiLoading) return;
    const userMsg = aiInput.trim();
    setAiInput("");
    setAiMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setAiLoading(true);

    const recentMoods = moodLogs.slice(0, 5).map(l =>
      `${l.mood.label} (${l.mood.emoji}) on ${l.date.toLocaleDateString()} — "${l.note}" Tags: ${l.tags.join(", ")}`
    ).join("\n");

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are MindSane AI — a compassionate, expert mental health companion. You speak warmly in a mix of simple English and Hindi phrases (like "Bilkul!", "Aap bahut brave hain!", "Chinta mat karo") to feel personal and friendly.

You analyze the user's mood, stress levels, sleep, and daily habits. Based on their input, you provide:
1. 🧘 Specific Yoga poses with instructions (e.g., Balasana for anxiety, Shavasana for rest)
2. 🏃 Exercise recommendations tailored to their energy level
3. 🌬️ Breathing exercises (e.g., 4-7-8 breathing, box breathing)
4. 🥗 Simple diet/nutrition tips
5. 😴 Sleep hygiene advice if needed
6. 👨‍⚕️ Clear recommendation to see a doctor/therapist if symptoms are serious (depression, severe anxiety, suicidal thoughts)
7. 📊 Pattern analysis from their recent mood logs

Recent mood history:
${recentMoods || "No logs yet."}

Always end with an encouraging, warm message. Be specific, actionable, and empathetic. If someone seems to be in crisis, ALWAYS recommend professional help first.`,
          messages: [
            ...aiMessages.map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: userMsg }
          ]
        })
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text).join("") || "I'm here for you. Could you tell me more?";
      setAiMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setAiMessages(prev => [...prev, { role: "assistant", content: "Connection issue. Please try again. You're not alone! 💙" }]);
    }
    setAiLoading(false);
  };

  const startBreathe = () => {
    setBreatheActive(true);
    setBreatheCount(0);
    let phase = "inhale";
    let count = 0;
    setBreathePhase("inhale");
    const phases = [
      { name: "inhale", duration: 4000 },
      { name: "hold", duration: 7000 },
      { name: "exhale", duration: 8000 },
    ];
    let pi = 0;
    const next = () => {
      pi = (pi + 1) % phases.length;
      if (pi === 0) { count++; setBreatheCount(count); if (count >= 3) { setBreatheActive(false); clearTimeout(breatheInterval.current); return; } }
      setBreathePhase(phases[pi].name);
      breatheInterval.current = setTimeout(next, phases[pi].duration);
    };
    breatheInterval.current = setTimeout(next, phases[0].duration);
  };

  const getMoodTrend = () => {
    if (weekLogs.length < 2) return "neutral";
    const recent = weekLogs.slice(0, 3).reduce((s, l) => s + l.mood.value, 0) / 3;
    const older = weekLogs.slice(3).reduce((s, l) => s + l.mood.value, 0) / Math.max(weekLogs.slice(3).length, 1);
    return recent > older ? "up" : recent < older ? "down" : "neutral";
  };

  const trend = getMoodTrend();

  return (
    <div style={{
      fontFamily: "'Nunito', 'Segoe UI', sans-serif",
      background: "linear-gradient(135deg, #0f0c29 0%, #1a1a3e 40%, #0f2027 100%)",
      minHeight: "100vh",
      color: "#e8e8ff",
      maxWidth: 480,
      margin: "0 auto",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient orbs */}
      <div style={{ position: "fixed", top: -80, right: -80, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(130,80,255,0.15) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: 100, left: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,210,255,0.1) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Header */}
      <div style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, background: "linear-gradient(90deg, #a78bfa, #60efff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🧠 MindSane</div>
          <div style={{ fontSize: 11, color: "#94a3b8", letterSpacing: 1 }}>YOUR AI MENTAL HEALTH COMPANION</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>Avg Mood</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#a78bfa" }}>{avgMood}/5</div>
        </div>
      </div>

      <div style={{ padding: "0 16px 100px", position: "relative", zIndex: 1 }}>

        {/* HOME SCREEN */}
        {screen === "home" && (
          <div>
            {/* Today's mood card */}
            <div style={{ margin: "20px 0 16px", background: "linear-gradient(135deg, rgba(167,139,250,0.15), rgba(96,239,255,0.08))", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 20, padding: 20 }}>
              <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>TODAY — {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</div>
              {moodLogs[0] && new Date(moodLogs[0].date).toDateString() === new Date().toDateString() ? (
                <div>
                  <div style={{ fontSize: 40 }}>{moodLogs[0].mood.emoji}</div>
                  <div style={{ fontWeight: 700, color: moodLogs[0].mood.color, fontSize: 18 }}>{moodLogs[0].mood.label}</div>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>{moodLogs[0].note}</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>You haven't logged your mood today</div>
                  <button onClick={() => setScreen("log")} style={{ background: "linear-gradient(135deg, #a78bfa, #60efff)", border: "none", borderRadius: 12, padding: "10px 20px", color: "#0f0c29", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>+ Log Mood Now</button>
                </div>
              )}
            </div>

            {/* Trend */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { label: "7-Day Avg", value: weekLogs.length ? (weekLogs.reduce((s, l) => s + l.mood.value, 0) / weekLogs.length).toFixed(1) : "—", icon: "📊", sub: "/5" },
                { label: "Trend", value: trend === "up" ? "↑ Better" : trend === "down" ? "↓ Lower" : "→ Stable", icon: "📈", color: trend === "up" ? "#4CAF50" : trend === "down" ? "#EF5350" : "#64B5F6" },
                { label: "Logs", value: moodLogs.length, icon: "📝", sub: " total" },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 18 }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: s.color || "#e8e8ff", marginTop: 4 }}>{s.value}{s.sub}</div>
                  <div style={{ fontSize: 10, color: "#64748b", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Mini mood chart */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 12 }}>📈 MOOD HISTORY</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
                {weekLogs.slice().reverse().map((log, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: "100%", background: log.mood.color, borderRadius: 4, height: `${((log.mood.value + 1) / 6) * 50}px`, opacity: 0.8, transition: "height 0.3s" }} />
                    <div style={{ fontSize: 9, color: "#64748b" }}>{new Date(log.date).toLocaleDateString("en", { weekday: "short" }).slice(0, 2)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 10 }}>QUICK ACTIONS</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { icon: "🧘", label: "Breathe", sub: "4-7-8 Exercise", action: () => setScreen("breathe") },
                { icon: "🤖", label: "AI Chat", sub: "Get wellness advice", action: () => setScreen("ai") },
                { icon: "📋", label: "Health Report", sub: "View your insights", action: () => setScreen("report") },
                { icon: "📔", label: "Mood Log", sub: "Track your mood", action: () => setScreen("log") },
              ].map((a, i) => (
                <button key={i} onClick={a.action} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "16px 14px", textAlign: "left", cursor: "pointer", color: "#e8e8ff", transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(167,139,250,0.15)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{a.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{a.sub}</div>
                </button>
              ))}
            </div>

            {/* Recent logs */}
            <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 10 }}>RECENT LOGS</div>
            {moodLogs.slice(0, 3).map((log, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "12px 14px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 28 }}>{log.mood.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: log.mood.color, fontSize: 14 }}>{log.mood.label}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{log.note}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                    {log.tags.slice(0, 3).map(t => <span key={t} style={{ fontSize: 10, background: "rgba(167,139,250,0.15)", color: "#a78bfa", borderRadius: 6, padding: "2px 7px" }}>{t}</span>)}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "#475569" }}>{new Date(log.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</div>
              </div>
            ))}
          </div>
        )}

        {/* MOOD LOG SCREEN */}
        {screen === "log" && (
          <div style={{ paddingTop: 20 }}>
            <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 14, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>← Back</button>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>How are you feeling?</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Aaj ka mood kya hai? Log it honestly.</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
              {MOODS.map(mood => (
                <button key={mood.value} onClick={() => setSelectedMood(mood)}
                  style={{ background: selectedMood?.value === mood.value ? `${mood.color}25` : "rgba(255,255,255,0.04)", border: `2px solid ${selectedMood?.value === mood.value ? mood.color : "rgba(255,255,255,0.1)"}`, borderRadius: 16, padding: "14px 8px", cursor: "pointer", transition: "all 0.2s", transform: selectedMood?.value === mood.value ? "scale(1.05)" : "scale(1)" }}>
                  <div style={{ fontSize: 28 }}>{mood.emoji}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: mood.color, marginTop: 6 }}>{mood.label}</div>
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 10 }}>WHAT'S ON YOUR MIND?</div>
              <textarea value={moodNote} onChange={e => setMoodNote(e.target.value)}
                placeholder="Describe how you feel... kuch bhi likho."
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 14, color: "#e8e8ff", fontSize: 14, minHeight: 90, resize: "none", outline: "none", boxSizing: "border-box" }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 10 }}>QUICK TAGS</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {QUICK_TAGS.map(tag => (
                  <button key={tag} onClick={() => toggleTag(tag)}
                    style={{ background: selectedTags.includes(tag) ? "rgba(167,139,250,0.25)" : "rgba(255,255,255,0.04)", border: `1px solid ${selectedTags.includes(tag) ? "#a78bfa" : "rgba(255,255,255,0.1)"}`, borderRadius: 20, padding: "6px 12px", fontSize: 12, color: selectedTags.includes(tag) ? "#a78bfa" : "#94a3b8", cursor: "pointer", transition: "all 0.2s" }}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={logMood} disabled={!selectedMood}
              style={{ width: "100%", background: selectedMood ? "linear-gradient(135deg, #a78bfa, #60efff)" : "rgba(255,255,255,0.1)", border: "none", borderRadius: 14, padding: "16px", color: selectedMood ? "#0f0c29" : "#475569", fontWeight: 800, fontSize: 16, cursor: selectedMood ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
              Save Mood Log ✨
            </button>
          </div>
        )}

        {/* AI CHAT SCREEN */}
        {screen === "ai" && (
          <div style={{ paddingTop: 20, display: "flex", flexDirection: "column", height: "calc(100vh - 180px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 14, cursor: "pointer" }}>←</button>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>🤖 MindSane AI</div>
                <div style={{ fontSize: 11, color: "#4CAF50" }}>● Online — Ready to help</div>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingBottom: 16 }}>
              {aiMessages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  {msg.role === "assistant" && <div style={{ fontSize: 24, marginRight: 8, flexShrink: 0 }}>🧠</div>}
                  <div style={{
                    maxWidth: "82%", padding: "12px 14px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: msg.role === "user" ? "linear-gradient(135deg, #a78bfa, #7c3aed)" : "rgba(255,255,255,0.06)",
                    border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.08)" : "none",
                    fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap"
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 24 }}>🧠</div>
                  <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "18px 18px 18px 4px", padding: "12px 16px", fontSize: 20 }}>
                    <span style={{ animation: "pulse 1s infinite" }}>●</span> <span style={{ animation: "pulse 1s 0.3s infinite" }}>●</span> <span style={{ animation: "pulse 1s 0.6s infinite" }}>●</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick prompts */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 8 }}>
              {["I feel anxious 😰", "Help me sleep better 😴", "I'm very stressed 😓", "Suggest yoga for me 🧘", "Do I need a doctor? 👨‍⚕️"].map(p => (
                <button key={p} onClick={() => { setAiInput(p); }}
                  style={{ flexShrink: 0, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 20, padding: "6px 12px", fontSize: 11, color: "#a78bfa", cursor: "pointer", whiteSpace: "nowrap" }}>
                  {p}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendToAI()}
                placeholder="Apna haal batao... I'm listening 💙"
                style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "12px 14px", color: "#e8e8ff", fontSize: 13, outline: "none" }} />
              <button onClick={sendToAI} disabled={aiLoading}
                style={{ background: "linear-gradient(135deg, #a78bfa, #60efff)", border: "none", borderRadius: 14, padding: "12px 16px", color: "#0f0c29", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
                →
              </button>
            </div>
          </div>
        )}

        {/* BREATHING SCREEN */}
        {screen === "breathe" && (
          <div style={{ paddingTop: 20, textAlign: "center" }}>
            <button onClick={() => { setScreen("home"); clearTimeout(breatheInterval.current); setBreatheActive(false); }} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 14, cursor: "pointer", display: "block", marginBottom: 20 }}>← Back</button>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>🌬️ Breathe with Me</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 40 }}>4-7-8 Breathing — Anxiety ke liye best</div>

            <div style={{ position: "relative", width: 200, height: 200, margin: "0 auto 40px" }}>
              <div style={{
                width: "100%", height: "100%", borderRadius: "50%",
                background: breatheActive
                  ? breathePhase === "inhale" ? "radial-gradient(circle, rgba(96,239,255,0.4), rgba(96,239,255,0.1))"
                    : breathePhase === "hold" ? "radial-gradient(circle, rgba(167,139,250,0.4), rgba(167,139,250,0.1))"
                    : "radial-gradient(circle, rgba(74,222,128,0.4), rgba(74,222,128,0.1))"
                  : "radial-gradient(circle, rgba(255,255,255,0.1), transparent)",
                border: `3px solid ${breatheActive ? breathePhase === "inhale" ? "#60efff" : breathePhase === "hold" ? "#a78bfa" : "#4ade80" : "rgba(255,255,255,0.2)"}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
                transition: "all 1s ease",
                transform: breatheActive && breathePhase === "inhale" ? "scale(1.15)" : breatheActive && breathePhase === "exhale" ? "scale(0.9)" : "scale(1)",
              }}>
                <div style={{ fontSize: 36 }}>
                  {!breatheActive ? "🫁" : breathePhase === "inhale" ? "😮‍💨" : breathePhase === "hold" ? "😶" : "😮"}
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#e8e8ff", marginTop: 8, textTransform: "uppercase", letterSpacing: 2 }}>
                  {!breatheActive ? "Ready" : breathePhase === "inhale" ? "Inhale" : breathePhase === "hold" ? "Hold" : "Exhale"}
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                  {!breatheActive ? "" : breathePhase === "inhale" ? "4 seconds" : breathePhase === "hold" ? "7 seconds" : "8 seconds"}
                </div>
              </div>
            </div>

            {breatheActive && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "#94a3b8" }}>Round {breatheCount + 1} of 3</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8 }}>
                  {[0, 1, 2].map(r => <div key={r} style={{ width: 10, height: 10, borderRadius: "50%", background: r < breatheCount ? "#4ade80" : r === breatheCount ? "#a78bfa" : "rgba(255,255,255,0.1)" }} />)}
                </div>
              </div>
            )}

            {!breatheActive && (
              <button onClick={startBreathe} style={{ background: "linear-gradient(135deg, #a78bfa, #60efff)", border: "none", borderRadius: 14, padding: "16px 40px", color: "#0f0c29", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
                Start Breathing
              </button>
            )}

            <div style={{ marginTop: 40, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 16, textAlign: "left" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 10 }}>🧘 YOGA FOR MENTAL HEALTH</div>
              {[
                { pose: "Balasana (Child's Pose)", benefit: "Anxiety & stress relief", time: "5 min" },
                { pose: "Viparita Karani (Legs-up-wall)", benefit: "Insomnia & fatigue", time: "10 min" },
                { pose: "Shavasana (Corpse Pose)", benefit: "Deep relaxation", time: "10 min" },
                { pose: "Anulom Vilom (Alternate nostril)", benefit: "Balances emotions", time: "5 min" },
              ].map((y, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{y.pose}</div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{y.benefit}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#a78bfa", fontWeight: 700 }}>{y.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HEALTH REPORT SCREEN */}
        {screen === "report" && (
          <div style={{ paddingTop: 20 }}>
            <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: "#a78bfa", fontSize: 14, cursor: "pointer", marginBottom: 16 }}>← Back</button>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>📊 Health Report</div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Aapki mental wellness summary</div>

            {/* Overall score */}
            <div style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.2), rgba(96,239,255,0.1))", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 20, padding: 20, marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 8 }}>WELLNESS SCORE</div>
              <div style={{ fontSize: 56, fontWeight: 900, background: "linear-gradient(135deg, #a78bfa, #60efff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {Math.round((parseFloat(avgMood) / 5) * 100) || 0}
              </div>
              <div style={{ fontSize: 14, color: "#94a3b8" }}>out of 100</div>
              <div style={{ marginTop: 12, fontSize: 13, color: "#4ade80" }}>
                {parseFloat(avgMood) >= 3.5 ? "✅ You're doing well! Keep it up." : parseFloat(avgMood) >= 2.5 ? "⚠️ Average — some support may help." : "🆘 Consider talking to a professional."}
              </div>
            </div>

            {/* Mood breakdown */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 12 }}>MOOD BREAKDOWN</div>
              {MOODS.map(mood => {
                const count = moodLogs.filter(l => l.mood.value === mood.value).length;
                const pct = moodLogs.length ? Math.round((count / moodLogs.length) * 100) : 0;
                return (
                  <div key={mood.value} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ fontSize: 18, width: 28 }}>{mood.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>{mood.label}</span>
                        <span style={{ fontSize: 12, color: mood.color, fontWeight: 700 }}>{pct}%</span>
                      </div>
                      <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: mood.color, borderRadius: 3, transition: "width 0.5s" }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Top tags */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 12 }}>COMMON TRIGGERS</div>
              {(() => {
                const tagCounts = {};
                moodLogs.forEach(l => l.tags.forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1));
                return Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([tag, count]) => (
                  <div key={tag} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize: 13 }}>{tag}</span>
                    <span style={{ fontSize: 12, background: "rgba(167,139,250,0.2)", color: "#a78bfa", borderRadius: 10, padding: "2px 10px", fontWeight: 700 }}>{count}x</span>
                  </div>
                ));
              })()}
            </div>

            {/* Recommendations */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 12 }}>💡 PERSONALIZED TIPS</div>
              {[
                { icon: "🧘", tip: "Try Balasana daily for 5 minutes to manage stress", color: "#4ade80" },
                { icon: "😴", tip: "Maintain 7-8 hours sleep — it directly impacts mood", color: "#60efff" },
                { icon: "🏃", tip: "30 min walk/jog boosts serotonin naturally", color: "#a78bfa" },
                { icon: "📱", tip: "Reduce screen time 1hr before bed for better sleep", color: "#fbbf24" },
                { icon: "👨‍⚕️", tip: parseFloat(avgMood) < 2.5 ? "Your mood score suggests talking to a therapist" : "Keep logging daily for better insights", color: parseFloat(avgMood) < 2.5 ? "#EF5350" : "#4ade80" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <div style={{ fontSize: 20 }}>{r.icon}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5, flex: 1 }}>
                    <span style={{ color: r.color, fontWeight: 700 }}>• </span>{r.tip}
                  </div>
                </div>
              ))}
            </div>

            {/* Doctor recommendation */}
            {parseFloat(avgMood) < 2.5 && (
              <div style={{ background: "rgba(239,83,80,0.1)", border: "1px solid rgba(239,83,80,0.3)", borderRadius: 16, padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#EF5350", marginBottom: 8 }}>👨‍⚕️ Professional Help Recommended</div>
                <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>Based on your mood patterns, speaking with a mental health professional could really help. Aap akele nahi hain — help lena bahut brave hai.</div>
                <button onClick={() => setScreen("ai")} style={{ marginTop: 12, background: "#EF5350", border: "none", borderRadius: 10, padding: "10px 16px", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  Chat with AI for Resources →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(15,12,41,0.9)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-around", padding: "10px 0 16px", zIndex: 100 }}>
        {[
          { icon: "🏠", label: "Home", s: "home" },
          { icon: "📔", label: "Log", s: "log" },
          { icon: "🤖", label: "AI Chat", s: "ai" },
          { icon: "🌬️", label: "Breathe", s: "breathe" },
          { icon: "📊", label: "Report", s: "report" },
        ].map(nav => (
          <button key={nav.s} onClick={() => setScreen(nav.s)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ fontSize: 20, opacity: screen === nav.s ? 1 : 0.4, transform: screen === nav.s ? "scale(1.2)" : "scale(1)", transition: "all 0.2s" }}>{nav.icon}</div>
            <div style={{ fontSize: 10, color: screen === nav.s ? "#a78bfa" : "#475569", fontWeight: screen === nav.s ? 800 : 400 }}>{nav.label}</div>
          </button>
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}
