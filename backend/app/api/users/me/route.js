import { eq } from 'drizzle-orm';
import { db, users } from '@/db';
import { findPublicUser, getUserId, publicUserColumns, unauthorized } from '@/lib/auth';

// Edit my profile
export async function PUT(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const { firstName, lastName, bio, avatar } = await request.json();
  if (!(await findPublicUser(userId))) return unauthorized();

  const changes = {};
  if (firstName?.trim()) changes.firstName = firstName.trim();
  if (lastName?.trim()) changes.lastName = lastName.trim();
  if (bio !== undefined) changes.bio = String(bio).trim();
  if (avatar !== undefined) changes.avatar = String(avatar).trim();

  if (Object.keys(changes).length === 0) {
    return Response.json({ user: await findPublicUser(userId) });
  }

  const [user] = await db.update(users).set(changes).where(eq(users.id, userId)).returning(publicUserColumns);

  return Response.json({ user });
}
