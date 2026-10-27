import { readDb, writeDb } from '@/lib/db';
import { getUserId, publicUser, unauthorized } from '@/lib/auth';

// Edit my profile
export async function PUT(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const { firstName, lastName, bio, avatar } = await request.json();

  const db = readDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return unauthorized();

  if (firstName?.trim()) user.firstName = firstName.trim();
  if (lastName?.trim()) user.lastName = lastName.trim();
  if (bio !== undefined) user.bio = bio.trim();
  if (avatar !== undefined) user.avatar = avatar.trim();

  writeDb(db);

  return Response.json({ user: publicUser(user) });
}
