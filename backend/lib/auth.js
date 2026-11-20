import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db, users } from '@/db';

const SECRET = process.env.JWT_SECRET || 'dev-secret';

export function createToken(user) {
  return jwt.sign({ id: user.id }, SECRET, { expiresIn: '7d' });
}

// Returns the id of the logged user, or null
export function getUserId(request) {
  const header = request.headers.get('authorization');
  if (!header || !header.startsWith('Bearer ')) return null;

  try {
    const payload = jwt.verify(header.slice(7), SECRET);
    return payload.id;
  } catch {
    return null;
  }
}

export function unauthorized() {
  return Response.json({ error: 'Vous devez être connecté' }, { status: 401 });
}

// Columns of a user that can be sent to the client (never the password)
export const publicUserColumns = {
  id: users.id,
  firstName: users.firstName,
  lastName: users.lastName,
  email: users.email,
  bio: users.bio,
  avatar: users.avatar,
  createdAt: users.createdAt,
};

// Removes the password before sending a user to the client
export function publicUser(user) {
  const { password, ...rest } = user;
  return rest;
}

export async function findPublicUser(id) {
  const [user] = await db.select(publicUserColumns).from(users).where(eq(users.id, id));
  return user;
}
