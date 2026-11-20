import { describe, expect, it } from 'vitest';
import { computeStreak } from './stats';

const today = new Date('2026-11-20T10:00:00Z');

describe('computeStreak', () => {
  it('returns 0 without any post', () => {
    expect(computeStreak([], today)).toBe(0);
  });

  it('counts consecutive days up to today', () => {
    const dates = ['2026-11-20T08:00:00Z', '2026-11-19T22:00:00Z', '2026-11-18T09:00:00Z'];
    expect(computeStreak(dates, today)).toBe(3);
  });

  it('counts several posts on the same day once', () => {
    expect(computeStreak(['2026-11-20T08:00:00Z', '2026-11-20T09:00:00Z'], today)).toBe(1);
  });

  it('stops at the first day without post', () => {
    expect(computeStreak(['2026-11-20T08:00:00Z', '2026-11-18T08:00:00Z'], today)).toBe(1);
  });

  it('returns 0 when there is no post today', () => {
    expect(computeStreak(['2026-11-19T08:00:00Z'], today)).toBe(0);
  });
});
