// Demonstration data. Can be run several times: existing demo accounts are kept.
import bcrypt from 'bcryptjs';
import { inArray } from 'drizzle-orm';
import { comments, db, likes, pool, posts, users, zones } from './index.js';

const PASSWORD = 'localloop';

const DEMO_USERS = [
  { firstName: 'Gérard', lastName: 'Martin', email: 'gerard@localloop.dev', bio: 'Retraité, jardinier du dimanche.' },
  { firstName: 'Inès', lastName: 'Benali', email: 'ines@localloop.dev', bio: 'Toujours partante pour un défi.' },
  { firstName: 'Chloé', lastName: 'Durand', email: 'chloe@localloop.dev', bio: '' },
  { firstName: 'Karim', lastName: 'Haddad', email: 'karim@localloop.dev', bio: "Président de l'association du quartier." },
];

const emails = DEMO_USERS.map((u) => u.email);
const existing = await db.select({ id: users.id }).from(users).where(inArray(users.email, emails));

if (existing.length > 0) {
  console.log('Demo data already present, nothing to do');
} else {
  const password = await bcrypt.hash(PASSWORD, 10);
  // Pilot zones are created by the migrations
  const [saintMichel, saintCyprien] = await db.select().from(zones).orderBy(zones.id).limit(2);
  const zoneOf = { 'gerard@localloop.dev': saintMichel, 'karim@localloop.dev': saintMichel };
  const [gerard, ines, chloe, karim] = await db
    .insert(users)
    .values(DEMO_USERS.map((u) => ({ ...u, password, zoneId: (zoneOf[u.email] || saintCyprien).id })))
    .returning();

  const [vide, potager, fete] = await db
    .insert(posts)
    .values([
      { authorId: karim.id, content: 'Vide-grenier samedi sur la place, inscriptions ouvertes !' },
      { authorId: gerard.id, content: 'Qui veut des plants de tomates ? J’en ai trop cette année.' },
      { authorId: ines.id, content: 'Fête des voisins le 30, chacun apporte un plat.' },
    ])
    .returning();

  await db.insert(likes).values([
    { postId: vide.id, userId: ines.id },
    { postId: vide.id, userId: chloe.id },
    { postId: potager.id, userId: karim.id },
    { postId: fete.id, userId: gerard.id },
  ]);
  await db.insert(comments).values([
    { postId: potager.id, authorId: chloe.id, content: 'Avec plaisir, je passe demain.' },
    { postId: fete.id, authorId: karim.id, content: 'L’association prête les tables.' },
  ]);

  console.log(`Demo data created (${DEMO_USERS.length} accounts, password "${PASSWORD}")`);
}

await pool.end();
