// ============================================================
//  MindSane — Constants
//  Mood definitions and quick-tag list
// ============================================================

export const MOODS = [
  { emoji: "😄", label: "Euphoric",  value: 5, color: "#FFD700" },
  { emoji: "😊", label: "Happy",     value: 4, color: "#4CAF50" },
  { emoji: "😐", label: "Neutral",   value: 3, color: "#64B5F6" },
  { emoji: "😔", label: "Sad",       value: 2, color: "#9575CD" },
  { emoji: "😰", label: "Anxious",   value: 1, color: "#EF5350" },
  { emoji: "😡", label: "Angry",     value: 0, color: "#F44336" },
];

export const QUICK_TAGS = [
  "Work stress",    "Family time",  "Exercise",    "Poor sleep",
  "Good meal",      "Social anxiety","Meditation",  "Creative",
  "Lonely",         "Grateful",     "Overwhelmed", "Energetic",
  "Tired",          "Focused",      "Distracted",
];

export const SAMPLE_LOGS = [
  { mood: MOODS[1], note: "Feeling productive today",          tags: ["Exercise", "Focused"] },
  { mood: MOODS[2], note: "Just an average day",               tags: ["Work stress"] },
  { mood: MOODS[0], note: "Had a great workout!",              tags: ["Exercise", "Energetic"] },
  { mood: MOODS[4], note: "Feeling overwhelmed with deadlines",tags: ["Work stress", "Poor sleep"] },
  { mood: MOODS[1], note: "Meditated for 20 mins",            tags: ["Meditation", "Grateful"] },
];

export const YOGA_POSES = [
  { pose: "Balasana (Child's Pose)",          benefit: "Anxiety & stress relief",  time: "5 min"  },
  { pose: "Viparita Karani (Legs-up-wall)",   benefit: "Insomnia & fatigue",       time: "10 min" },
  { pose: "Shavasana (Corpse Pose)",          benefit: "Deep relaxation",           time: "10 min" },
  { pose: "Anulom Vilom (Alternate nostril)", benefit: "Balances emotions",         time: "5 min"  },
];

export const BREATHE_PHASES = [
  { name: "inhale",  duration: 4000 },
  { name: "hold",    duration: 7000 },
  { name: "exhale",  duration: 8000 },
];

// Anthropic Claude API endpoint
export const AI_API_URL = "https://api.anthropic.com/v1/messages";
export const AI_MODEL   = "claude-sonnet-4-20250514";
