import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createToken, publicUserSelect } from '@/lib/auth';

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
  if (await prisma.user.findUnique({ where: { email: emailLower }, select: { id: true } })) {
    return Response.json({ error: 'Cet email est déjà utilisé' }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: emailLower,
      password: await bcrypt.hash(password, 10),
    },
    select: publicUserSelect,
  });

  return Response.json({ token: createToken(user), user }, { status: 201 });
}
