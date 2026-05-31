/**
 * Formats a duration in seconds to a human-readable string (e.g. 5m 23s or 45s).
 */
export const formatDuration = (seconds: number): string => {
  if (seconds <= 0) return '0s';
  const min = Math.floor(seconds / 60);
  const sec = Math.round(seconds % 60);
  return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
};

/**
 * Calculates score earned for an answer based on difficulty multiplier.
 */
export const calculateScore = (difficulty: number): number => {
  return difficulty * 100;
};

/**
 * Deduces difficulty adjective label based on difficulty tier.
 */
export const getDifficultyLabel = (difficulty: number): string => {
  const labels = ['Beginner', 'Easy', 'Medium', 'Advanced', 'Expert'];
  return labels[Math.min(Math.max(difficulty - 1, 0), 4)];
};
