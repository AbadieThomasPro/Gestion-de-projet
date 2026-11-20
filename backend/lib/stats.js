import { prisma } from './prisma';

// Day of a date, as "YYYY-MM-DD" in UTC (the dates are stored in UTC)
function toDay(date) {
  return new Date(date).toISOString().slice(0, 10);
}

// Number of consecutive days, up to today included, with at least one post.
// Pure function: no database access, so it can be tested alone.
export function computeStreak(dates, today) {
  const days = new Set(dates.map(toDay));
  const day = new Date(toDay(today));
  let streak = 0;

  while (days.has(toDay(day))) {
    streak += 1;
    day.setUTCDate(day.getUTCDate() - 1);
  }
  return streak;
}

// Posts, likes and comments received on these posts, and current streak of a user
export async function getUserStats(userId, today = new Date()) {
  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    select: { createdAt: true, _count: { select: { likes: true, comments: true } } },
  });

  return {
    userId,
    posts: posts.length,
    likesReceived: posts.reduce((sum, p) => sum + p._count.likes, 0),
    commentsReceived: posts.reduce((sum, p) => sum + p._count.comments, 0),
    currentStreak: computeStreak(
      posts.map((p) => p.createdAt),
      today
    ),
  };
}
