import { prisma } from '@/lib/prisma';
import { getUserId, unauthorized } from '@/lib/auth';
import { isUuid } from '@/lib/ids';

// Delete one of my posts
export async function DELETE(request, { params }) {
  const userId = getUserId(request);
  if (!userId) return unauthorized();

  const post = isUuid(params.id) && (await prisma.post.findUnique({ where: { id: params.id } }));

  if (!post) {
    return Response.json({ error: 'Publication introuvable' }, { status: 404 });
  }
  if (post.authorId !== userId) {
    return Response.json({ error: 'Vous ne pouvez supprimer que vos publications' }, { status: 403 });
  }

  // Likes, comments and notifications of the post are deleted in cascade
  await prisma.post.delete({ where: { id: post.id } });

  return Response.json({ message: 'Publication supprimée' });
}
