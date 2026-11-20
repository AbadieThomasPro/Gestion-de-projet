import { requirePublicUser, requireUser } from '@/lib/auth';
import { getFriendStatus } from '@/lib/friends';
import { withErrorHandler } from '@/lib/handler';
import { listPosts } from '@/lib/posts';

// Profile of a user with their posts
export const GET = withErrorHandler(async (request, { params }) => {
  const userId = requireUser(request);
  const user = await requirePublicUser(params.id);

  const [posts, friendStatus] = await Promise.all([
    listPosts({ userId, where: { authorId: user.id } }),
    getFriendStatus(userId, user.id),
  ]);

  return Response.json({ user, posts, friendStatus });
});
