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
export function getUserStats(db, userId, today = new Date()) {
  const posts = db.posts.filter((p) => p.authorId === userId);
  const postIds = new Set(posts.map((p) => p.id));

  return {
    userId,
    posts: posts.length,
    likesReceived: db.likes.filter((l) => postIds.has(l.postId)).length,
    commentsReceived: db.comments.filter((c) => postIds.has(c.postId)).length,
    currentStreak: computeStreak(
      posts.map((p) => p.createdAt),
      today
    ),
  };
}
