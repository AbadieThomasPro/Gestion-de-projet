import { db, posts } from '@/db';
import { getUserId, unauthorized } from '@/lib/auth';
import { getPost, listPosts } from '@/lib/posts';

const PAGE_SIZE = 10;

// Feed, 10 posts per page (?page=1)
export async function GET(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const page = Math.max(1, Math.floor(Number(new URL(request.url).searchParams.get('page'))) || 1);

  // One more post than needed tells if there is a next page
  const list = await listPosts({ userId, limit: PAGE_SIZE + 1, offset: (page - 1) * PAGE_SIZE });

  return Response.json({ posts: list.slice(0, PAGE_SIZE), hasMore: list.length > PAGE_SIZE });
}

// Publish a post
export async function POST(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const { content } = await request.json();
  if (!content || !content.trim()) {
    return Response.json({ error: 'La publication est vide' }, { status: 400 });
  }

  const [post] = await db.insert(posts).values({ authorId: userId, content: content.trim() }).returning();

  return Response.json({ post: await getPost(post.id, userId) }, { status: 201 });
}
