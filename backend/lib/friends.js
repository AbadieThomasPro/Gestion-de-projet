import { prisma } from './prisma';

// Request between two users, whatever its direction
export function findFriendRequest(userId, otherId) {
  return prisma.friendRequest.findFirst({
    where: {
      OR: [
        { fromId: userId, toId: otherId },
        { fromId: otherId, toId: userId },
      ],
    },
  });
}

// Returns the relation between two users: 'me', 'friends', 'sent', 'received' or 'none'
export async function getFriendStatus(userId, otherId) {
  if (userId === otherId) return 'me';

  const request = await findFriendRequest(userId, otherId);
  if (!request) return 'none';
  if (request.status === 'accepted') return 'friends';
  return request.fromId === userId ? 'sent' : 'received';
}
