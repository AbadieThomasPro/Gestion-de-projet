// Validation of the request bodies. Messages are shown under the fields by the front.
import { z } from 'zod';

const required = (label) => ({ required_error: `${label} est obligatoire.`, invalid_type_error: `${label} est invalide.` });

const name = (label) =>
  z
    .string(required(label))
    .trim()
    .min(1, `${label} est obligatoire.`)
    .max(50, `${label} ne doit pas dépasser 50 caractères.`);

const email = z
  .string(required("L'email"))
  .trim()
  .toLowerCase()
  .min(1, "L'email est obligatoire.")
  .max(254, "L'email est trop long.")
  .email("L'email n'est pas valide.");

const text = (label, max) =>
  z
    .string(required(label))
    .trim()
    .min(1, `${label} est vide.`)
    .max(max, `${label} ne doit pas dépasser ${max} caractères.`);

export const registerSchema = z.object({
  firstName: name('Le prénom'),
  lastName: name('Le nom'),
  email,
  password: z
    .string(required('Le mot de passe'))
    .min(6, 'Le mot de passe doit faire au moins 6 caractères.')
    // bcrypt only uses the first 72 bytes
    .max(72, 'Le mot de passe ne doit pas dépasser 72 caractères.'),
});

export const loginSchema = z.object({
  email: z.string(required("L'email")).trim().toLowerCase().min(1, "L'email est obligatoire."),
  password: z.string(required('Le mot de passe')).min(1, 'Le mot de passe est obligatoire.'),
});

export const postSchema = z.object({ content: text('La publication', 2000) });

export const commentSchema = z.object({ content: text('Le commentaire', 1000) });

export const profileSchema = z.object({
  firstName: name('Le prénom').optional(),
  lastName: name('Le nom').optional(),
  bio: z.string().trim().max(500, 'La bio ne doit pas dépasser 500 caractères.').optional(),
  avatar: z
    .union([z.literal(''), z.string().trim().url("L'avatar doit être une adresse web.").max(500)])
    .optional(),
});

export const friendRequestSchema = z.object({
  toId: z.string(required("L'utilisateur")).uuid("L'utilisateur est invalide."),
});
