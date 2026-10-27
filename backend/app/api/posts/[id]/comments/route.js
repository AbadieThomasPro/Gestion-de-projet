import { readDb, writeDb } from '@/lib/db';
import { getUserId, publicUser, unauthorized } from '@/lib/auth';
import { addNotification } from '@/lib/notifications';

function withAuthor(db, comment) {
  const author = db.users.find((u) => u.id === comment.authorId);
  return { ...comment, author: author ? publicUser(author) : null };
}

// Comments of a post
export function GET(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const db = readDb();
  const comments = db.comments
    .filter((c) => c.postId === params.id)
    .map((c) => withAuthor(db, c));

  return Response.json({ comments });
}

// Comment a post
export async function POST(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const { content } = await request.json();
  if (!content || !content.trim()) {
    return Response.json({ error: 'Le commentaire est vide' }, { status: 400 });
  }

  const db = readDb();
  if (!db.posts.some((p) => p.id === params.id)) {
    return Response.json({ error: 'Publication introuvable' }, { status: 404 });
  }

  const comment = {
    id: crypto.randomUUID(),
    postId: params.id,
    authorId: userId,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  db.comments.push(comment);
  addNotification(db, { type: 'comment', postId: params.id, fromId: userId });
  writeDb(db);

  return Response.json({ comment: withAuthor(db, comment) }, { status: 201 });
}
