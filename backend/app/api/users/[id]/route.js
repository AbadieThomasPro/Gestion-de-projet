import { eq } from 'drizzle-orm';
import { posts } from '@/db';
import { requirePublicUser, requireUser } from '@/lib/auth';
import { getFriendStatus } from '@/lib/friends';
import { withErrorHandler } from '@/lib/handler';
import { listPosts } from '@/lib/posts';

// Profile of a user with their posts
export const GET = withErrorHandler(async (request, { params }) => {
  const userId = requireUser(request);
  const user = await requirePublicUser(params.id);

  const [userPosts, friendStatus] = await Promise.all([
    listPosts({ userId, where: eq(posts.authorId, user.id) }),
    getFriendStatus(userId, user.id),
  ]);

  return Response.json({ user, posts: userPosts, friendStatus });
});
