// Fake data shared by the stories
export const gerard = {
  id: '00000000-0000-4000-8000-000000000001',
  firstName: 'Gérard',
  lastName: 'Martin',
  email: 'gerard@localloop.dev',
  bio: 'Retraité, jardinier du dimanche.',
  avatar: '',
  zoneId: 1,
  zone: { id: 1, name: 'Saint-Michel', city: 'Toulouse' },
  createdAt: '2026-11-01T09:00:00.000Z',
};

export const chloe = { ...gerard, id: '00000000-0000-4000-8000-000000000002', firstName: 'Chloé', lastName: 'Durand' };

export const post = {
  id: '00000000-0000-4000-8000-0000000000aa',
  authorId: gerard.id,
  author: gerard,
  content: 'Qui veut des plants de tomates ? J’en ai trop cette année.',
  createdAt: '2026-11-20T08:30:00.000Z',
  likesCount: 3,
  likedByMe: false,
  commentsCount: 1,
};

export const zones = [
  { id: 1, name: 'Saint-Michel', city: 'Toulouse' },
  { id: 2, name: 'Saint-Cyprien', city: 'Toulouse' },
  { id: 3, name: 'Les Carmes', city: 'Toulouse' },
  { id: 4, name: 'Saint-Aubin', city: 'Toulouse' },
  { id: 5, name: 'Compans-Caffarelli', city: 'Toulouse' },
];
