import { readDb } from '@/lib/db';
import { getUserId, publicUser, unauthorized } from '@/lib/auth';
import { formatPost, sortByDate } from '@/lib/posts';
import { getFriendStatus } from '@/lib/friends';

// Profile of a user with their posts
export function GET(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const db = readDb();
  const user = db.users.find((u) => u.id === params.id);
  if (!user) {
    return Response.json({ error: 'Utilisateur introuvable' }, { status: 404 });
  }

  const posts = sortByDate(db.posts.filter((p) => p.authorId === user.id)).map((p) =>
    formatPost(db, p, userId)
  );

  return Response.json({
    user: publicUser(user),
    posts,
    friendStatus: getFriendStatus(db, userId, user.id),
  });
}
