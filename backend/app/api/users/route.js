import { and, ilike, ne, sql } from 'drizzle-orm';
import { db, users } from '@/db';
import { publicUserColumns, requireUser } from '@/lib/auth';
import { withErrorHandler } from '@/lib/handler';

// Search users by name
export const GET = withErrorHandler(async (request) => {
  const userId = requireUser(request);

  const search = (new URL(request.url).searchParams.get('search') || '').trim();
  if (!search) return Response.json({ users: [] });

  // % and _ typed by the user are searched as plain characters
  const pattern = `%${search.replace(/[\\%_]/g, '\\$&')}%`;

  const list = await db
    .select(publicUserColumns)
    .from(users)
    .where(and(ne(users.id, userId), ilike(sql`${users.firstName} || ' ' || ${users.lastName}`, pattern)));

  return Response.json({ users: list });
});
