import { asc, eq } from 'drizzle-orm';
import { comments, db, users } from '@/db';
import { findPublicUser, publicUserColumns, requireUser } from '@/lib/auth';
import { withErrorHandler } from '@/lib/handler';
import { addNotification } from '@/lib/notifications';
import { requirePostId } from '@/lib/posts';
import { commentSchema } from '@/lib/schemas';
import { parseBody } from '@/lib/validation';

// Comments of a post
export const GET = withErrorHandler(async (request, { params }) => {
  requireUser(request);
  const post = await requirePostId(params.id);

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
    .where(eq(comments.postId, post.id))
    .orderBy(asc(comments.createdAt));

  return Response.json({ comments: list });
});

// Comment a post
export const POST = withErrorHandler(async (request, { params }) => {
  const userId = requireUser(request);
  const { content } = await parseBody(request, commentSchema);
  const post = await requirePostId(params.id);

  const [comment] = await db.insert(comments).values({ postId: post.id, authorId: userId, content }).returning();
  await addNotification({ type: 'comment', postId: post.id, fromId: userId });

  return Response.json({ comment: { ...comment, author: await findPublicUser(userId) } }, { status: 201 });
});
