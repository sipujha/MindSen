// ============================================================
//  MindSane — useMoodLogs Hook
//  Manages mood log state and derived analytics
// ============================================================

import { useState, useMemo } from 'react';
import { MOODS, SAMPLE_LOGS } from '../constants';

// Seed sample data with proper Date objects offset by day
const seedLogs = SAMPLE_LOGS.map((log, i) => ({
  ...log,
  date: new Date(Date.now() - (i + 1) * 86400000),
}));

export function useMoodLogs() {
  const [moodLogs, setMoodLogs] = useState(seedLogs);

  const addLog = (mood, note, tags) => {
    setMoodLogs(prev => [{ mood, note, tags, date: new Date() }, ...prev]);
  };

  // Average mood score across all logs
  const avgMood = useMemo(() => {
    if (!moodLogs.length) return null;
    return (moodLogs.reduce((s, l) => s + l.mood.value, 0) / moodLogs.length).toFixed(1);
  }, [moodLogs]);

  // Wellness score out of 100
  const wellnessScore = useMemo(() => {
    if (!avgMood) return 0;
    return Math.round((parseFloat(avgMood) / 5) * 100);
  }, [avgMood]);

  // Mood trend: compare recent 3 vs older
  const trend = useMemo(() => {
    const week = moodLogs.slice(0, 7);
    if (week.length < 2) return 'neutral';
    const recent = week.slice(0, 3).reduce((s, l) => s + l.mood.value, 0) / 3;
    const older  = week.slice(3).reduce((s, l) => s + l.mood.value, 0) / Math.max(week.slice(3).length, 1);
    return recent > older ? 'up' : recent < older ? 'down' : 'neutral';
  }, [moodLogs]);

  // Mood frequency breakdown
  const moodBreakdown = useMemo(() => {
    return MOODS.map(mood => {
      const count = moodLogs.filter(l => l.mood.value === mood.value).length;
      const pct = moodLogs.length ? Math.round((count / moodLogs.length) * 100) : 0;
      return { ...mood, count, pct };
    });
  }, [moodLogs]);

  // Top 5 most used tags
  const topTags = useMemo(() => {
    const tagCounts = {};
    moodLogs.forEach(l => l.tags.forEach(t => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    }));
    return Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [moodLogs]);

  return { moodLogs, addLog, avgMood, wellnessScore, trend, moodBreakdown, topTags };
}
