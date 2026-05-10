// ============================================================
//  MindSane — useBreathe Hook
//  Manages the 4-7-8 breathing exercise state
// ============================================================

import { useState, useRef } from 'react';
import { BREATHE_PHASES } from '../constants';

const TOTAL_ROUNDS = 3;

export function useBreathe() {
  const [active, setActive]   = useState(false);
  const [phase,  setPhase]    = useState('inhale');
  const [round,  setRound]    = useState(0);
  const timerRef              = useRef(null);
  let   phaseIndex            = useRef(0);
  let   roundCount            = useRef(0);

  const stop = () => {
    clearTimeout(timerRef.current);
    setActive(false);
  };

  const start = () => {
    phaseIndex.current = 0;
    roundCount.current = 0;
    setActive(true);
    setRound(0);
    setPhase('inhale');

    const tick = () => {
      phaseIndex.current = (phaseIndex.current + 1) % BREATHE_PHASES.length;
      const next = BREATHE_PHASES[phaseIndex.current];

      // Completed one full cycle
      if (phaseIndex.current === 0) {
        roundCount.current += 1;
        setRound(roundCount.current);
        if (roundCount.current >= TOTAL_ROUNDS) {
          setActive(false);
          return;
        }
      }

      setPhase(next.name);
      timerRef.current = setTimeout(tick, next.duration);
    };

    timerRef.current = setTimeout(tick, BREATHE_PHASES[0].duration);
  };

  return { active, phase, round, totalRounds: TOTAL_ROUNDS, start, stop };
}
