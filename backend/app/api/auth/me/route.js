import { findPublicUser, getUserId, unauthorized } from '@/lib/auth';

// Get the logged user
export async function GET(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const user = await findPublicUser(userId);
  if (!user) return unauthorized();

  return Response.json({ user });
}
