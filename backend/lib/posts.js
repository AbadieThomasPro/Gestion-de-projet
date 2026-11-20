import { publicUserSelect } from './auth';
import { prisma } from './prisma';

// Fields of a post sent to the client: author, likes and comments count, liked by the reader
function postSelect(userId) {
  return {
    id: true,
    authorId: true,
    content: true,
    createdAt: true,
    author: { select: publicUserSelect },
    _count: { select: { likes: true, comments: true } },
    likes: { where: { userId }, select: { userId: true } },
  };
}

function formatPost({ _count, likes, ...post }) {
  return { ...post, likesCount: _count.likes, likedByMe: likes.length > 0, commentsCount: _count.comments };
}

// Posts from the most recent, with optional filter and pagination
export async function listPosts({ userId, where, take, skip = 0 }) {
  const posts = await prisma.post.findMany({
    where,
    select: postSelect(userId),
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take,
    skip,
  });
  return posts.map(formatPost);
}

export async function getPost(postId, userId) {
  const post = await prisma.post.findUnique({ where: { id: postId }, select: postSelect(userId) });
  return post && formatPost(post);
}
