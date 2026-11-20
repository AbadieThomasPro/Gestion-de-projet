import { asc, eq } from 'drizzle-orm';
import { comments, db, posts, users } from '@/db';
import { findPublicUser, getUserId, publicUserColumns, unauthorized } from '@/lib/auth';
import { addNotification } from '@/lib/notifications';
import { isUuid } from '@/lib/ids';

// Comments of a post
export async function GET(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();
  if (!isUuid(params.id)) return Response.json({ comments: [] });

  const list = await db
    .select({
      id: comments.id,
      postId: comments.postId,
      authorId: comments.authorId,
      content: comments.content,
      createdAt: comments.createdAt,
      author: publicUserColumns,
    })
    .from(comments)
    .innerJoin(users, eq(users.id, comments.authorId))
    .where(eq(comments.postId, params.id))
    .orderBy(asc(comments.createdAt));

  return Response.json({ comments: list });
}

// Comment a post
export async function POST(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const { content } = await request.json();
  if (!content || !content.trim()) {
    return Response.json({ error: 'Le commentaire est vide' }, { status: 400 });
  }

  const [post] = isUuid(params.id)
    ? await db.select({ id: posts.id }).from(posts).where(eq(posts.id, params.id))
    : [];
  if (!post) {
    return Response.json({ error: 'Publication introuvable' }, { status: 404 });
  }

  const [comment] = await db
    .insert(comments)
    .values({ postId: post.id, authorId: userId, content: content.trim() })
    .returning();
  await addNotification({ type: 'comment', postId: post.id, fromId: userId });

  return Response.json({ comment: { ...comment, author: await findPublicUser(userId) } }, { status: 201 });
}
