import bcrypt from 'bcryptjs';
import { readDb } from '@/lib/db';
import { createToken, publicUser } from '@/lib/auth';

// Log in and get a token
export async function POST(request) {
  const { email, password } = await request.json();

  const db = readDb();
  const user = db.users.find((u) => u.email === email?.trim().toLowerCase());

  if (!user || !(await bcrypt.compare(password || '', user.password))) {
    return Response.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
  }

  return Response.json({ token: createToken(user), user: publicUser(user) });
}
