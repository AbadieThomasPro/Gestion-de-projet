// Notifies the author of a post when someone likes or comments it
export function addNotification(db, { type, postId, fromId }) {
  const post = db.posts.find((p) => p.id === postId);
  if (!post || post.authorId === fromId) return;

  db.notifications.push({
    id: crypto.randomUUID(),
    userId: post.authorId,
    fromId,
    type,
    postId,
    read: false,
    createdAt: new Date().toISOString(),
  });
}
