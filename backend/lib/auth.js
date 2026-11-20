import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

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

// Fields of a user that can be sent to the client (never the password)
export const publicUserSelect = {
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  bio: true,
  avatar: true,
  createdAt: true,
};

export function findPublicUser(id) {
  return prisma.user.findUnique({ where: { id }, select: publicUserSelect });
}
