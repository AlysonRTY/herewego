import { useState, useCallback } from "react";

interface GameStats {
  score: number;
  highScore: number;
  moves?: number;
  time?: number;
  level?: number;
}

interface UseGameStatsOptions {
  storageKey: string;
  initialStats?: Partial<GameStats>;
}

export function useGameStats({
  storageKey,
  initialStats = {},
}: UseGameStatsOptions) {
  const [stats, setStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem(storageKey);
    const defaultStats: GameStats = {
      score: 0,
      highScore: 0,
      moves: 0,
      time: 0,
      level: 1,
      ...initialStats,
    };

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultStats, ...parsed };
      } catch {
        return defaultStats;
      }
    }

    return defaultStats;
  });

  const updateStats = useCallback(
    (newStats: Partial<GameStats>) => {
      setStats((prev) => {
        const updated = { ...prev, ...newStats };

        // Auto-update high score if current score is higher
        if (newStats.score !== undefined && newStats.score > prev.highScore) {
          updated.highScore = newStats.score;
        }

        // Save to localStorage
        localStorage.setItem(storageKey, JSON.stringify(updated));

        return updated;
      });
    },
    [storageKey]
  );

  const resetStats = useCallback(
    (keepHighScore = true) => {
      setStats((prev) => {
        const reset: GameStats = {
          score: 0,
          highScore: keepHighScore ? prev.highScore : 0,
          moves: 0,
          time: 0,
          level: 1,
          ...initialStats,
        };

        localStorage.setItem(storageKey, JSON.stringify(reset));
        return reset;
      });
    },
    [storageKey, initialStats]
  );

  return {
    stats,
    updateStats,
    resetStats,
  };
}
