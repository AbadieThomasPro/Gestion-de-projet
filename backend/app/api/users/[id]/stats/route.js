import { requirePublicUser, requireUser } from '@/lib/auth';
import { withErrorHandler } from '@/lib/handler';
import { getUserStats } from '@/lib/stats';

// Statistics of a user: posts, likes and comments received, current streak
export const GET = withErrorHandler(async (request, { params }) => {
  requireUser(request);
  const user = await requirePublicUser(params.id);

  return Response.json(await getUserStats(user.id));
});
