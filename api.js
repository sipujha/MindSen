// ============================================================
//  MindSane — AI API Integration
//  Connects to Anthropic Claude API for mental health advice
// ============================================================

import { AI_API_URL, AI_MODEL } from './constants';

/**
 * Builds the system prompt for the MindSane AI companion.
 * Includes the user's recent mood history for context.
 */
function buildSystemPrompt(moodLogs) {
  const recentMoods = moodLogs
    .slice(0, 5)
    .map(l =>
      `${l.mood.label} (${l.mood.emoji}) on ${new Date(l.date).toLocaleDateString()} — "${l.note}" Tags: ${l.tags.join(', ')}`
    )
    .join('\n');

  return `You are MindSane AI — a compassionate, expert mental health companion. You speak warmly in a mix of simple English and Hindi phrases (like "Bilkul!", "Aap bahut brave hain!", "Chinta mat karo") to feel personal and friendly.

You analyze the user's mood, stress levels, sleep, and daily habits. Based on their input, you provide:
1. 🧘 Specific Yoga poses with instructions (e.g., Balasana for anxiety, Shavasana for rest)
2. 🏃 Exercise recommendations tailored to their energy level
3. 🌬️ Breathing exercises (e.g., 4-7-8 breathing, box breathing)
4. 🥗 Simple diet/nutrition tips
5. 😴 Sleep hygiene advice if needed
6. 👨‍⚕️ Clear recommendation to see a doctor/therapist if symptoms are serious (depression, severe anxiety, suicidal thoughts)
7. 📊 Pattern analysis from their recent mood logs

Recent mood history:
${recentMoods || 'No logs yet.'}

Always end with an encouraging, warm message. Be specific, actionable, and empathetic. If someone seems to be in crisis, ALWAYS recommend professional help first.`;
}

/**
 * Sends a message to the Claude API and returns the AI response text.
 * @param {Array}  conversationHistory  - Array of {role, content} message objects
 * @param {string} newUserMessage       - The latest message from the user
 * @param {Array}  moodLogs             - Recent mood logs for context
 * @returns {Promise<string>}           - AI response text
 */
export async function sendMessageToAI(conversationHistory, newUserMessage, moodLogs) {
  const response = await fetch(AI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: 1000,
      system: buildSystemPrompt(moodLogs),
      messages: [
        ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: newUserMessage },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content?.map(b => b.text).join('') || "I'm here for you. Could you tell me more?";
}
