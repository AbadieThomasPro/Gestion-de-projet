// Demonstration data (npm run db:seed -w backend). Can be run several times: existing demo accounts are kept.
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';

const PASSWORD = 'localloop';

const DEMO_USERS = [
  { firstName: 'Gérard', lastName: 'Martin', email: 'gerard@localloop.dev', bio: 'Retraité, jardinier du dimanche.' },
  { firstName: 'Inès', lastName: 'Benali', email: 'ines@localloop.dev', bio: 'Toujours partante pour un défi.' },
  { firstName: 'Chloé', lastName: 'Durand', email: 'chloe@localloop.dev', bio: '' },
  { firstName: 'Karim', lastName: 'Haddad', email: 'karim@localloop.dev', bio: "Président de l'association du quartier." },
];

const existing = await prisma.user.count({ where: { email: { in: DEMO_USERS.map((u) => u.email) } } });

if (existing > 0) {
  console.log('Demo data already present, nothing to do');
} else {
  const password = await bcrypt.hash(PASSWORD, 10);
  const [gerard, ines, chloe, karim] = await Promise.all(
    DEMO_USERS.map((u) => prisma.user.create({ data: { ...u, password } }))
  );

  const vide = await prisma.post.create({
    data: { authorId: karim.id, content: 'Vide-grenier samedi sur la place, inscriptions ouvertes !' },
  });
  const potager = await prisma.post.create({
    data: { authorId: gerard.id, content: 'Qui veut des plants de tomates ? J’en ai trop cette année.' },
  });
  const fete = await prisma.post.create({
    data: { authorId: ines.id, content: 'Fête des voisins le 30, chacun apporte un plat.' },
  });

  await prisma.like.createMany({
    data: [
      { postId: vide.id, userId: ines.id },
      { postId: vide.id, userId: chloe.id },
      { postId: potager.id, userId: karim.id },
      { postId: fete.id, userId: gerard.id },
    ],
  });
  await prisma.comment.createMany({
    data: [
      { postId: potager.id, authorId: chloe.id, content: 'Avec plaisir, je passe demain.' },
      { postId: fete.id, authorId: karim.id, content: 'L’association prête les tables.' },
    ],
  });

  console.log(`Demo data created (${DEMO_USERS.length} accounts, password "${PASSWORD}")`);
}

await prisma.$disconnect();
