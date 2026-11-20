import { eq, sql } from 'drizzle-orm';
import { db, posts } from '@/db';

// Drizzle writes posts.id as a bare "id" in subqueries, which would point to comments.id
const POST_ID = sql.raw('"posts"."id"');

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
  const rows = await db
    .select({
      createdAt: posts.createdAt,
      likes: sql`(select count(*) from likes where likes.post_id = ${POST_ID})`.mapWith(Number),
      comments: sql`(select count(*) from comments where comments.post_id = ${POST_ID})`.mapWith(Number),
    })
    .from(posts)
    .where(eq(posts.authorId, userId));

  return {
    userId,
    posts: rows.length,
    likesReceived: rows.reduce((sum, r) => sum + r.likes, 0),
    commentsReceived: rows.reduce((sum, r) => sum + r.comments, 0),
    currentStreak: computeStreak(
      rows.map((r) => r.createdAt),
      today
    ),
  };
}
