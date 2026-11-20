import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db, users } from '@/db';
import { createToken, publicUser } from '@/lib/auth';
import { AppError } from '@/lib/errors';
import { withErrorHandler } from '@/lib/handler';
import { loginSchema } from '@/lib/schemas';
import { parseBody } from '@/lib/validation';

// Log in and get a token
export const POST = withErrorHandler(async (request) => {
  const { email, password } = await parseBody(request, loginSchema);

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('LL_LOGIN_401');
  }

  return Response.json({ token: createToken(user), user: publicUser(user) });
});
