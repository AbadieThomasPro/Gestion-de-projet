import { publicUser } from './auth';

// Adds author, likes and comments count to a post
export function formatPost(db, post, userId) {
  const author = db.users.find((u) => u.id === post.authorId);
  const likes = db.likes.filter((l) => l.postId === post.id);

  return {
    ...post,
    author: author ? publicUser(author) : null,
    likesCount: likes.length,
    likedByMe: likes.some((l) => l.userId === userId),
    commentsCount: db.comments.filter((c) => c.postId === post.id).length,
  };
}

export function sortByDate(list) {
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
