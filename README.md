# 🧠 MindSane — AI Mental Health Tracker

> Aapka personal AI mental wellness companion — powered by Claude AI

---

## 📁 Project Structure

```
mindsane/
├── public/
│   └── index.html              ← HTML entry point
├── src/
│   ├── index.js                ← React root render
│   ├── App.js                  ← App wrapper
│   ├── MindSane.js             ← Main orchestrator component
│   ├── api.js                  ← Anthropic Claude API integration
│   ├── constants.js            ← Moods, tags, yoga poses, config
│   ├── hooks/
│   │   ├── useMoodLogs.js      ← Mood state + analytics
│   │   └── useBreathe.js       ← 4-7-8 breathing exercise logic
│   ├── components/
│   │   ├── Header.js           ← Top header bar
│   │   └── BottomNav.js        ← Bottom navigation
│   └── screens/
│       ├── HomeScreen.js       ← Dashboard + mood chart
│       ├── MoodLogScreen.js    ← Log mood with tags
│       ├── AIChatScreen.js     ← AI chat (Claude API)
│       ├── BreatheScreen.js    ← Breathing + yoga guide
│       └── ReportScreen.js     ← Health analytics report
│   └── styles/
│       └── theme.js            ← Design tokens / colors
└── package.json
```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js (v16 or higher)
- npm

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start

# 3. Open in browser
# http://localhost:3000
```

### Build for Production (CD/USB)
```bash
npm run build
# Output will be in /build folder — open build/index.html
```

---

## 🤖 AI Integration (Anthropic Claude API)

The AI Chat screen connects to **Anthropic Claude API**.

The API call is in `src/api.js`:
- Model: `claude-sonnet-4-20250514`
- Endpoint: `https://api.anthropic.com/v1/messages`

The AI provides:
- 🧘 Yoga poses (Balasana, Shavasana, Anulom Vilom)
- 🏃 Exercise recommendations
- 🌬️ Breathing techniques
- 😴 Sleep hygiene tips
- 👨‍⚕️ Doctor referral when needed
- Warm Hindi+English mixed responses

---

## ✨ Features

| Screen | Description |
|--------|-------------|
| 🏠 **Home** | Today's mood, 7-day bar chart, stats, recent logs |
| 📔 **Mood Log** | 6 moods, free-text note, 15 quick tags |
| 🤖 **AI Chat** | Real-time AI mental health advice via Claude API |
| 🌬️ **Breathe** | 4-7-8 animated breathing + yoga guide |
| 📊 **Report** | Wellness score, mood breakdown, triggers, tips |

---

## 🎨 Design

- **Theme**: Dark cosmic (deep purple + cyan)
- **Font**: Nunito (Google Fonts)
- **Style**: Glassmorphism + gradient cards
- **Mobile-first**: Optimized for 480px width

---

## 👨‍💻 Built With

- React 18
- Anthropic Claude API (claude-sonnet-4)
- Google Fonts (Nunito)
- Pure CSS-in-JS (no external UI library)

---

*Made with 💜 for MindSane Presentation*
