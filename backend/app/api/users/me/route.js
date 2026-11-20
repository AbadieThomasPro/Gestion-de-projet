import { eq } from 'drizzle-orm';
import { db, users } from '@/db';
import { findPublicUser, publicUserColumns, requireUser } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { withErrorHandler } from '@/lib/handler';
import { profileSchema } from '@/lib/schemas';
import { parseBody } from '@/lib/validation';

// Edit my profile
export const PUT = withErrorHandler(async (request) => {
  const userId = requireUser(request);
  const changes = await parseBody(request, profileSchema);

  const [user] =
    Object.keys(changes).length > 0
      ? await db.update(users).set(changes).where(eq(users.id, userId)).returning(publicUserColumns)
      : [await findPublicUser(userId)];
  if (!user) throw new AppError('LL_AUTH_401');

  return Response.json({ user });
});
