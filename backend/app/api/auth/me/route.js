import { readDb } from '@/lib/db';
import { getUserId, publicUser, unauthorized } from '@/lib/auth';

// Get the logged user
export function GET(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const user = readDb().users.find((u) => u.id === userId);
  if (!user) return unauthorized();

  return Response.json({ user: publicUser(user) });
}
