import { publicUserSelect, requireUser } from '@/lib/auth';
import { withErrorHandler } from '@/lib/handler';
import { prisma } from '@/lib/prisma';

// Search users by name
export const GET = withErrorHandler(async (request) => {
  const userId = requireUser(request);

  const search = (new URL(request.url).searchParams.get('search') || '').trim();
  if (!search) return Response.json({ users: [] });

  // Every word must match the first or the last name ("Chloé Dur" finds Chloé Durand)
  const words = search.split(/\s+/);
  const users = await prisma.user.findMany({
    where: {
      id: { not: userId },
      AND: words.map((word) => ({
        OR: [
          { firstName: { contains: word, mode: 'insensitive' } },
          { lastName: { contains: word, mode: 'insensitive' } },
        ],
      })),
    },
    select: publicUserSelect,
  });

  return Response.json({ users });
});
