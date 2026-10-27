// Returns the relation between two users: 'me', 'friends', 'sent', 'received' or 'none'
export function getFriendStatus(db, userId, otherId) {
  if (userId === otherId) return 'me';

  const request = db.friendRequests.find(
    (r) =>
      (r.fromId === userId && r.toId === otherId) ||
      (r.fromId === otherId && r.toId === userId)
  );

  if (!request) return 'none';
  if (request.status === 'accepted') return 'friends';
  return request.fromId === userId ? 'sent' : 'received';
}
