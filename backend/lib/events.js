import { publicUserSelect } from './auth';
import { prisma } from './prisma';

// Fields of an event sent to the client, with its author and its neighbourhood
const eventSelect = {
  id: true,
  authorId: true,
  zoneId: true,
  title: true,
  description: true,
  place: true,
  startsAt: true,
  createdAt: true,
  author: { select: publicUserSelect },
  zone: { select: { id: true, name: true, city: true } },
};

// Upcoming events of a zone, from the nearest date
export function listEvents({ zoneId, take, skip = 0 }) {
  return prisma.event.findMany({
    where: { zoneId, startsAt: { gte: new Date() } },
    select: eventSelect,
    orderBy: [{ startsAt: 'asc' }, { id: 'asc' }],
    take,
    skip,
  });
}

export function createEvent(data) {
  return prisma.event.create({ data, select: eventSelect });
}
