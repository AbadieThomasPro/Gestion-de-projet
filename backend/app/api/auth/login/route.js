import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createToken, findPublicUser } from '@/lib/auth';

// Log in and get a token
export async function POST(request) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({ where: { email: String(email || '').trim().toLowerCase() } });

  if (!user || !(await bcrypt.compare(password || '', user.password))) {
    return Response.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
  }

  return Response.json({ token: createToken(user), user: await findPublicUser(user.id) });
}
