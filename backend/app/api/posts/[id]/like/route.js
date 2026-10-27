import { readDb, writeDb } from '@/lib/db';
import { getUserId, unauthorized } from '@/lib/auth';
import { addNotification } from '@/lib/notifications';

// Like or unlike a post
export function POST(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const db = readDb();
  if (!db.posts.some((p) => p.id === params.id)) {
    return Response.json({ error: 'Publication introuvable' }, { status: 404 });
  }

  const alreadyLiked = db.likes.some((l) => l.postId === params.id && l.userId === userId);

  if (alreadyLiked) {
    db.likes = db.likes.filter((l) => !(l.postId === params.id && l.userId === userId));
    db.notifications = db.notifications.filter(
      (n) => !(n.type === 'like' && n.postId === params.id && n.fromId === userId && !n.read)
    );
  } else {
    db.likes.push({ postId: params.id, userId });
    addNotification(db, { type: 'like', postId: params.id, fromId: userId });
  }
  writeDb(db);

  return Response.json({
    liked: !alreadyLiked,
    likesCount: db.likes.filter((l) => l.postId === params.id).length,
  });
}
