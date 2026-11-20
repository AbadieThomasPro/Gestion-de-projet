import { requirePublicUser, requireUser } from '@/lib/auth';
import { withErrorHandler } from '@/lib/handler';
import { listPosts } from '@/lib/posts';

// Profile of a user with their posts
export const GET = withErrorHandler(async (request, { params }) => {
  const userId = requireUser(request);
  const user = await requirePublicUser(params.id);

  const posts = await listPosts({ userId, where: { authorId: user.id } });

  return Response.json({ user, posts, isMe: userId === user.id });
});
