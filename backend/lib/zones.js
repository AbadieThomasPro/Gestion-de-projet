import { AppError } from './errors';
import { prisma } from './prisma';

export function listZones() {
  return prisma.zone.findMany({ orderBy: [{ city: 'asc' }, { name: 'asc' }] });
}

// Existing zone, LL_ZONE_404 otherwise
export async function requireZone(zoneId) {
  const zone = await prisma.zone.findUnique({ where: { id: zoneId } });
  if (!zone) throw new AppError('LL_ZONE_404');
  return zone;
}

// Zone of a user (null for the accounts created before the zones), LL_AUTH_401 if the account was deleted
export async function findUserZoneId(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { zoneId: true } });
  if (!user) throw new AppError('LL_AUTH_401');
  return user.zoneId;
}
