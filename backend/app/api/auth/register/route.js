import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db, users } from '@/db';
import { createToken, findPublicUser } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { withErrorHandler } from '@/lib/handler';
import { registerSchema } from '@/lib/schemas';
import { parseBody } from '@/lib/validation';
import { requireZone } from '@/lib/zones';

// Create an account
export const POST = withErrorHandler(async (request) => {
  const { firstName, lastName, email, password, zoneId } = await parseBody(request, registerSchema);

  await requireZone(zoneId);

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (existing) throw new AppError('LL_EMAIL_409');

  const [user] = await db
    .insert(users)
    .values({ firstName, lastName, email, password: await bcrypt.hash(password, 10), zoneId })
    .onConflictDoNothing({ target: users.email })
    .returning({ id: users.id });
  // Two registrations with the same email at the same time
  if (!user) throw new AppError('LL_EMAIL_409');

  return Response.json({ token: createToken(user), user: await findPublicUser(user.id) }, { status: 201 });
});
