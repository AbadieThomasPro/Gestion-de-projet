import bcrypt from 'bcryptjs';
import { readDb, writeDb } from '@/lib/db';
import { createToken, publicUser } from '@/lib/auth';

// Create an account
export async function POST(request) {
  const { firstName, lastName, email, password } = await request.json();

  if (!firstName || !lastName || !email || !password) {
    return Response.json({ error: 'Tous les champs sont obligatoires' }, { status: 400 });
  }
  if (password.length < 6) {
    return Response.json({ error: 'Le mot de passe doit faire au moins 6 caractères' }, { status: 400 });
  }

  const db = readDb();
  const emailLower = email.trim().toLowerCase();

  if (db.users.some((u) => u.email === emailLower)) {
    return Response.json({ error: 'Cet email est déjà utilisé' }, { status: 409 });
  }

  const user = {
    id: crypto.randomUUID(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: emailLower,
    password: await bcrypt.hash(password, 10),
    bio: '',
    avatar: '',
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  writeDb(db);

  return Response.json({ token: createToken(user), user: publicUser(user) }, { status: 201 });
}
