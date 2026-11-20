import { asc, eq } from 'drizzle-orm';
import { db, zones } from '@/db';
import { AppError } from './errors';

export function listZones() {
  return db.select().from(zones).orderBy(asc(zones.city), asc(zones.name));
}

// Existing zone, LL_ZONE_404 otherwise
export async function requireZone(zoneId) {
  const [zone] = await db.select().from(zones).where(eq(zones.id, zoneId));
  if (!zone) throw new AppError('LL_ZONE_404');
  return zone;
}
