import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db, users } from '@/db';
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

  const emailLower = email.trim().toLowerCase();
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, emailLower));
  if (existing) {
    return Response.json({ error: 'Cet email est déjà utilisé' }, { status: 409 });
  }

  const [user] = await db
    .insert(users)
    .values({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: emailLower,
      password: await bcrypt.hash(password, 10),
    })
    .returning();

  return Response.json({ token: createToken(user), user: publicUser(user) }, { status: 201 });
}
