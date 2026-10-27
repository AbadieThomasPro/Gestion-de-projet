import { readDb } from '@/lib/db';
import { getUserId, publicUser, unauthorized } from '@/lib/auth';

// Search users by name
export function GET(request) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const search = (new URL(request.url).searchParams.get('search') || '').trim().toLowerCase();
  if (!search) return Response.json({ users: [] });

  const users = readDb()
    .users.filter((u) => u.id !== userId)
    .filter((u) => `${u.firstName} ${u.lastName}`.toLowerCase().includes(search))
    .map(publicUser);

  return Response.json({ users });
}
