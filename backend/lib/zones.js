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
