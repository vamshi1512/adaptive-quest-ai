import { describe, it, expect } from 'vitest';
import { formatDuration, calculateScore, getDifficultyLabel } from '../utils/formatters';

describe('Frontend Formatter Utilities', () => {
  describe('formatDuration', () => {
    it('should format 0 seconds to 0s', () => {
      expect(formatDuration(0)).toBe('0s');
    });

    it('should format sub-minute durations to seconds only', () => {
      expect(formatDuration(45)).toBe('45s');
    });

    it('should format durations over one minute to minutes and seconds', () => {
      expect(formatDuration(125)).toBe('2m 5s');
    });

    it('should handle negative bounds safely', () => {
      expect(formatDuration(-10)).toBe('0s');
    });
  });

  describe('calculateScore', () => {
    it('should scale scores linearly by difficulty index', () => {
      expect(calculateScore(1)).toBe(100);
      expect(calculateScore(3)).toBe(300);
      expect(calculateScore(5)).toBe(500);
    });
  });

  describe('getDifficultyLabel', () => {
    it('should map difficulty index to correct readability tier name', () => {
      expect(getDifficultyLabel(1)).toBe('Beginner');
      expect(getDifficultyLabel(3)).toBe('Medium');
      expect(getDifficultyLabel(5)).toBe('Expert');
    });

    it('should clamp bounds gracefully for out-of-range difficulties', () => {
      expect(getDifficultyLabel(0)).toBe('Beginner');
      expect(getDifficultyLabel(6)).toBe('Expert');
    });
  });
});
