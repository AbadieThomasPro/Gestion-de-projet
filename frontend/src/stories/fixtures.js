// Fake data shared by the stories
export const gerard = {
  id: '00000000-0000-4000-8000-000000000001',
  firstName: 'Gérard',
  lastName: 'Martin',
  email: 'gerard@localloop.dev',
  bio: 'Retraité, jardinier du dimanche.',
  avatar: '',
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
