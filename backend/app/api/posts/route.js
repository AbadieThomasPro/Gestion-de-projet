import { readDb, writeDb } from '@/lib/db';
import { getUserId, unauthorized } from '@/lib/auth';
import { formatPost, sortByDate } from '@/lib/posts';

const PAGE_SIZE = 10;

// Feed, 10 posts per page (?page=1)
export function GET(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const page = Number(new URL(request.url).searchParams.get('page')) || 1;
  const db = readDb();
  const allPosts = sortByDate(db.posts);
  const start = (page - 1) * PAGE_SIZE;

  const posts = allPosts.slice(start, start + PAGE_SIZE).map((p) => formatPost(db, p, userId));

  return Response.json({ posts, hasMore: start + PAGE_SIZE < allPosts.length });
}

// Publish a post
export async function POST(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const { content } = await request.json();
  if (!content || !content.trim()) {
    return Response.json({ error: 'La publication est vide' }, { status: 400 });
  }

  const db = readDb();
  const post = {
    id: crypto.randomUUID(),
    authorId: userId,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  db.posts.push(post);
  writeDb(db);

  return Response.json({ post: formatPost(db, post, userId) }, { status: 201 });
}
