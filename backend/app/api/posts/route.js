import { requireUser } from '@/lib/auth';
import { withErrorHandler } from '@/lib/handler';
import { getPost, listPosts } from '@/lib/posts';
import { prisma } from '@/lib/prisma';
import { postSchema } from '@/lib/schemas';
import { parseBody } from '@/lib/validation';

const PAGE_SIZE = 10;

// Feed, 10 posts per page (?page=1)
export const GET = withErrorHandler(async (request) => {
  const userId = requireUser(request);

  const page = Math.max(1, Math.floor(Number(new URL(request.url).searchParams.get('page'))) || 1);

  // One more post than needed tells if there is a next page
  const list = await listPosts({ userId, take: PAGE_SIZE + 1, skip: (page - 1) * PAGE_SIZE });

  return Response.json({ posts: list.slice(0, PAGE_SIZE), hasMore: list.length > PAGE_SIZE });
});

// Publish a post
export const POST = withErrorHandler(async (request) => {
  const userId = requireUser(request);
  const { content } = await parseBody(request, postSchema);

  const post = await prisma.post.create({ data: { authorId: userId, content } });

  return Response.json({ post: await getPost(post.id, userId) }, { status: 201 });
});
