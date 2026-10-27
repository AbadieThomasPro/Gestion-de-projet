import { readDb, writeDb } from '@/lib/db';
import { getUserId, unauthorized } from '@/lib/auth';

// Delete one of my posts
export function DELETE(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const db = readDb();
  const post = db.posts.find((p) => p.id === params.id);

  if (!post) {
    return Response.json({ error: 'Publication introuvable' }, { status: 404 });
  }
  if (post.authorId !== userId) {
    return Response.json({ error: 'Vous ne pouvez supprimer que vos publications' }, { status: 403 });
  }

  db.posts = db.posts.filter((p) => p.id !== post.id);
  db.likes = db.likes.filter((l) => l.postId !== post.id);
  db.comments = db.comments.filter((c) => c.postId !== post.id);
  db.notifications = db.notifications.filter((n) => n.postId !== post.id);
  writeDb(db);

  return Response.json({ message: 'Publication supprimée' });
}
