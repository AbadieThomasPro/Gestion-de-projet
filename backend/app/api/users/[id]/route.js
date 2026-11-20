import { eq } from 'drizzle-orm';
import { posts } from '@/db';
import { findPublicUser, getUserId, unauthorized } from '@/lib/auth';
import { listPosts } from '@/lib/posts';
import { getFriendStatus } from '@/lib/friends';
import { isUuid } from '@/lib/ids';

// Profile of a user with their posts
export async function GET(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const user = isUuid(params.id) ? await findPublicUser(params.id) : null;
  if (!user) {
    return Response.json({ error: 'Utilisateur introuvable' }, { status: 404 });
  }

  const [userPosts, friendStatus] = await Promise.all([
    listPosts({ userId, where: eq(posts.authorId, user.id) }),
    getFriendStatus(userId, user.id),
  ]);

  return Response.json({ user, posts: userPosts, friendStatus });
}
