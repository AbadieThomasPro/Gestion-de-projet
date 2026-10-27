import { readDb, writeDb } from '@/lib/db';
import { getUserId, publicUser, unauthorized } from '@/lib/auth';
import { sortByDate } from '@/lib/posts';

// My notifications
export function GET(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const db = readDb();
  const notifications = sortByDate(db.notifications.filter((n) => n.userId === userId)).map((n) => ({
    ...n,
    from: publicUser(db.users.find((u) => u.id === n.fromId)),
    postContent: db.posts.find((p) => p.id === n.postId)?.content,
  }));

  return Response.json({ notifications });
}

// Mark all my notifications as read
export function PUT(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const db = readDb();
  for (const n of db.notifications) {
    if (n.userId === userId) n.read = true;
  }
  writeDb(db);

  return Response.json({ message: 'Notifications lues' });
}
