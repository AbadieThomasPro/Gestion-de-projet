import { desc, eq, sql } from 'drizzle-orm';
import { db, posts, users } from '@/db';
import { publicUserColumns } from './auth';
import { AppError } from './errors';
import { isUuid } from './ids';

// Drizzle writes posts.id as a bare "id" in subqueries, which would point to comments.id
const POST_ID = sql.raw('"posts"."id"');

// Columns of a post sent to the client: author, likes and comments count
function postColumns(userId) {
  return {
    id: posts.id,
    authorId: posts.authorId,
    content: posts.content,
    createdAt: posts.createdAt,
    author: publicUserColumns,
    likesCount: sql`(select count(*) from likes where likes.post_id = ${POST_ID})`.mapWith(Number),
    likedByMe: sql`exists(select 1 from likes where likes.post_id = ${POST_ID} and likes.user_id = ${userId})`.mapWith(
      Boolean
    ),
    commentsCount: sql`(select count(*) from comments where comments.post_id = ${POST_ID})`.mapWith(Number),
  };
}

// Posts from the most recent, with optional filter and pagination
export function listPosts({ userId, where, limit, offset = 0 }) {
  let query = db
    .select(postColumns(userId))
    .from(posts)
    .innerJoin(users, eq(users.id, posts.authorId))
    .where(where)
    .orderBy(desc(posts.createdAt), desc(posts.id))
    .offset(offset);
  if (limit) query = query.limit(limit);
  return query;
}

export async function getPost(postId, userId) {
  const [post] = await listPosts({ userId, where: eq(posts.id, postId), limit: 1 });
  return post;
}

// Id of an existing post, LL_POST_404 otherwise
export async function requirePostId(postId) {
  if (!isUuid(postId)) throw new AppError('LL_POST_404');
  const [post] = await db.select({ id: posts.id, authorId: posts.authorId }).from(posts).where(eq(posts.id, postId));
  if (!post) throw new AppError('LL_POST_404');
  return post;
}
