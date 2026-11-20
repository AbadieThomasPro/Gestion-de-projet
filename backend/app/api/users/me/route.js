import { prisma } from '@/lib/prisma';
import { findPublicUser, getUserId, publicUserSelect, unauthorized } from '@/lib/auth';

// Edit my profile
export async function PUT(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const { firstName, lastName, bio, avatar } = await request.json();
  if (!(await findPublicUser(userId))) return unauthorized();

  const data = {};
  if (firstName?.trim()) data.firstName = firstName.trim();
  if (lastName?.trim()) data.lastName = lastName.trim();
  if (bio !== undefined) data.bio = String(bio).trim();
  if (avatar !== undefined) data.avatar = String(avatar).trim();

  const user = await prisma.user.update({ where: { id: userId }, data, select: publicUserSelect });

  return Response.json({ user });
}
