// OpenAPI document of the API, served by /api/openapi.json and shown by Swagger UI on /api/docs.
// Request bodies reuse the Zod schemas of lib/schemas.js: the doc cannot drift from the validation.
// A test checks that every route of app/api is documented here.
import { OpenAPIRegistry, OpenApiGeneratorV3, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { ERRORS, ERROR_TYPE_BASE } from './errors';
import {
  commentSchema,
  friendRequestSchema,
  loginSchema,
  postSchema,
  profileSchema,
  registerSchema,
} from './schemas';

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

const bearer = registry.registerComponent('securitySchemes', 'bearer', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

// ---------- Schemas ----------

const id = z.string().uuid();
const date = z.string().datetime();

const User = registry.register(
  'User',
  z.object({
    id,
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    bio: z.string(),
    avatar: z.string(),
    createdAt: date,
  })
);

const Post = registry.register(
  'Post',
  z.object({
    id,
    authorId: id,
    content: z.string(),
    createdAt: date,
    author: User,
    likesCount: z.number().int(),
    likedByMe: z.boolean(),
    commentsCount: z.number().int(),
  })
);

const Comment = registry.register(
  'Comment',
  z.object({ id, postId: id, authorId: id, content: z.string(), createdAt: date, author: User })
);

const FriendRequest = registry.register(
  'FriendRequest',
  z.object({ id, fromId: id, toId: id, status: z.enum(['pending', 'accepted']), createdAt: date })
);

const Notification = registry.register(
  'Notification',
  z.object({
    id,
    userId: id,
    fromId: id,
    type: z.enum(['like', 'comment']),
    postId: id,
    read: z.boolean(),
    createdAt: date,
    from: User,
    postContent: z.string(),
  })
);

const Stats = registry.register(
  'UserStats',
  z.object({
    userId: id,
    posts: z.number().int(),
    likesReceived: z.number().int(),
    commentsReceived: z.number().int(),
    currentStreak: z.number().int().openapi({ description: 'Jours consécutifs avec une publication' }),
  })
);

const Auth = z.object({ token: z.string(), user: User });
const Message = z.object({ message: z.string() });

const Problem = registry.register(
  'Problem',
  z
    .object({
      type: z.string().url().openapi({ example: `${ERROR_TYPE_BASE}LL_POST_404` }),
      title: z.string().openapi({ example: ERRORS.LL_POST_404.title }),
      status: z.number().int().openapi({ example: 404 }),
      code: z.enum(Object.keys(ERRORS)),
      detail: z.string(),
      instance: z.string().openapi({ example: '/api/posts/42' }),
      traceId: z.string().uuid(),
      errors: z
        .array(z.object({ field: z.string(), code: z.string(), message: z.string() }))
        .optional()
        .openapi({ description: 'Erreurs 422 uniquement, une entrée par champ' }),
    })
    .openapi({ description: 'Erreur au format RFC 7807, voir ERRORS.md' })
);

registry.register('RegisterBody', registerSchema);
registry.register('LoginBody', loginSchema);
registry.register('PostBody', postSchema);
registry.register('CommentBody', commentSchema);
registry.register('ProfileBody', profileSchema);
registry.register('FriendRequestBody', friendRequestSchema);

// ---------- Helpers ----------

const traceHeader = {
  'X-Trace-Id': { description: 'Identifiant de la requête, présent dans les logs serveur', schema: { type: 'string' } },
};

function ok(schema, description = 'Succès') {
  return { description, headers: traceHeader, content: { 'application/json': { schema } } };
}

// Error responses: one entry per HTTP status, listing the possible codes
function errors(...codes) {
  const byStatus = {};
  for (const code of codes) {
    const { status, title } = ERRORS[code];
    (byStatus[status] ||= []).push(`\`${code}\` : ${title}`);
  }
  return Object.fromEntries(
    Object.entries(byStatus).map(([status, lines]) => [
      status,
      { description: lines.join('<br>'), headers: traceHeader, content: { 'application/problem+json': { schema: Problem } } },
    ])
  );
}

const body = (schema) => ({ body: { required: true, content: { 'application/json': { schema } } } });
const idParam = (description) => ({ params: z.object({ id: id.openapi({ description }) }) });

// Every protected route can answer 401, 422 (body) and 500
const AUTH = ['LL_AUTH_401'];
const ALWAYS = ['LL_INTERNAL_500'];

function route({ method, path, tags, summary, auth = true, request, responses, codes = [] }) {
  registry.registerPath({
    method,
    path,
    tags,
    summary,
    ...(auth && { security: [{ [bearer.name]: [] }] }),
    request,
    responses: { ...responses, ...errors(...(auth ? AUTH : []), ...codes, ...ALWAYS) },
  });
}

// ---------- Routes ----------

route({
  method: 'get',
  path: '/api/health',
  tags: ['Système'],
  summary: "Vérifier que l'API répond",
  auth: false,
  responses: { 200: ok(z.object({ status: z.literal('ok') })) },
});

route({
  method: 'post',
  path: '/api/auth/register',
  tags: ['Authentification'],
  summary: 'Créer un compte',
  auth: false,
  request: body(registerSchema),
  responses: { 201: ok(Auth, 'Compte créé') },
  codes: ['LL_VALIDATION_422', 'LL_EMAIL_409'],
});

route({
  method: 'post',
  path: '/api/auth/login',
  tags: ['Authentification'],
  summary: 'Se connecter et obtenir un token',
  auth: false,
  request: body(loginSchema),
  responses: { 200: ok(Auth) },
  codes: ['LL_VALIDATION_422', 'LL_LOGIN_401'],
});

route({
  method: 'get',
  path: '/api/auth/me',
  tags: ['Authentification'],
  summary: "L'utilisateur connecté",
  responses: { 200: ok(z.object({ user: User })) },
});

route({
  method: 'get',
  path: '/api/posts',
  tags: ['Publications'],
  summary: "Fil d'actualité, 10 publications par page",
  request: { query: z.object({ page: z.number().int().min(1).optional().openapi({ example: 1 }) }) },
  responses: { 200: ok(z.object({ posts: z.array(Post), hasMore: z.boolean() })) },
});

route({
  method: 'post',
  path: '/api/posts',
  tags: ['Publications'],
  summary: 'Publier',
  request: body(postSchema),
  responses: { 201: ok(z.object({ post: Post }), 'Publication créée') },
  codes: ['LL_VALIDATION_422'],
});

route({
  method: 'delete',
  path: '/api/posts/{id}',
  tags: ['Publications'],
  summary: 'Supprimer une de mes publications',
  request: idParam('Identifiant de la publication'),
  responses: { 200: ok(Message) },
  codes: ['LL_AUTH_403', 'LL_POST_404'],
});

route({
  method: 'post',
  path: '/api/posts/{id}/like',
  tags: ['Publications'],
  summary: "Aimer ou ne plus aimer une publication",
  request: idParam('Identifiant de la publication'),
  responses: { 200: ok(z.object({ liked: z.boolean(), likesCount: z.number().int() })) },
  codes: ['LL_POST_404'],
});

route({
  method: 'get',
  path: '/api/posts/{id}/comments',
  tags: ['Publications'],
  summary: "Commentaires d'une publication",
  request: idParam('Identifiant de la publication'),
  responses: { 200: ok(z.object({ comments: z.array(Comment) })) },
  codes: ['LL_POST_404'],
});

route({
  method: 'post',
  path: '/api/posts/{id}/comments',
  tags: ['Publications'],
  summary: 'Commenter une publication',
  request: { ...idParam('Identifiant de la publication'), ...body(commentSchema) },
  responses: { 201: ok(z.object({ comment: Comment }), 'Commentaire créé') },
  codes: ['LL_VALIDATION_422', 'LL_POST_404'],
});

route({
  method: 'get',
  path: '/api/users',
  tags: ['Utilisateurs'],
  summary: 'Rechercher des utilisateurs par nom',
  request: { query: z.object({ search: z.string().optional().openapi({ example: 'Chloé' }) }) },
  responses: { 200: ok(z.object({ users: z.array(User) })) },
});

route({
  method: 'put',
  path: '/api/users/me',
  tags: ['Utilisateurs'],
  summary: 'Modifier mon profil',
  request: body(profileSchema),
  responses: { 200: ok(z.object({ user: User })) },
  codes: ['LL_VALIDATION_422'],
});

route({
  method: 'get',
  path: '/api/users/{id}',
  tags: ['Utilisateurs'],
  summary: "Profil d'un utilisateur et ses publications",
  request: idParam("Identifiant de l'utilisateur"),
  responses: {
    200: ok(
      z.object({
        user: User,
        posts: z.array(Post),
        friendStatus: z.enum(['me', 'friends', 'sent', 'received', 'none']),
      })
    ),
  },
  codes: ['LL_USER_404'],
});

route({
  method: 'get',
  path: '/api/users/{id}/stats',
  tags: ['Utilisateurs'],
  summary: "Statistiques d'un utilisateur",
  request: idParam("Identifiant de l'utilisateur"),
  responses: { 200: ok(Stats) },
  codes: ['LL_USER_404'],
});

route({
  method: 'get',
  path: '/api/friends',
  tags: ['Amis'],
  summary: 'Mes amis',
  responses: { 200: ok(z.object({ friends: z.array(User) })) },
});

route({
  method: 'get',
  path: '/api/friends/requests',
  tags: ['Amis'],
  summary: "Demandes d'ami reçues",
  responses: { 200: ok(z.object({ requests: z.array(FriendRequest.extend({ from: User })) })) },
});

route({
  method: 'post',
  path: '/api/friends/requests',
  tags: ['Amis'],
  summary: "Envoyer une demande d'ami",
  request: body(friendRequestSchema),
  responses: { 201: ok(z.object({ request: FriendRequest }), 'Demande envoyée') },
  codes: ['LL_VALIDATION_422', 'LL_USER_404', 'LL_FRIEND_REQUEST_409'],
});

route({
  method: 'put',
  path: '/api/friends/requests/{id}',
  tags: ['Amis'],
  summary: 'Accepter une demande',
  request: idParam('Identifiant de la demande'),
  responses: { 200: ok(z.object({ request: FriendRequest })) },
  codes: ['LL_FRIEND_REQUEST_404'],
});

route({
  method: 'delete',
  path: '/api/friends/requests/{id}',
  tags: ['Amis'],
  summary: 'Refuser une demande',
  request: idParam('Identifiant de la demande'),
  responses: { 200: ok(Message) },
  codes: ['LL_FRIEND_REQUEST_404'],
});

route({
  method: 'get',
  path: '/api/notifications',
  tags: ['Notifications'],
  summary: 'Mes notifications',
  responses: { 200: ok(z.object({ notifications: z.array(Notification) })) },
});

route({
  method: 'put',
  path: '/api/notifications',
  tags: ['Notifications'],
  summary: 'Marquer toutes mes notifications comme lues',
  responses: { 200: ok(Message) },
});

route({
  method: 'get',
  path: '/api/notifications/count',
  tags: ['Notifications'],
  summary: 'Compteurs de la barre de navigation',
  responses: { 200: ok(z.object({ notifications: z.number().int(), friendRequests: z.number().int() })) },
});

// The doc routes themselves
route({
  method: 'get',
  path: '/api/openapi.json',
  tags: ['Système'],
  summary: 'Ce document OpenAPI',
  auth: false,
  responses: { 200: ok(z.object({}).passthrough()) },
});

route({
  method: 'get',
  path: '/api/docs',
  tags: ['Système'],
  summary: 'Swagger UI',
  auth: false,
  responses: { 200: { description: 'Page HTML', content: { 'text/html': { schema: { type: 'string' } } } } },
});

route({
  method: 'get',
  path: '/api/docs/assets/{file}',
  tags: ['Système'],
  summary: 'Fichiers de Swagger UI',
  auth: false,
  request: { params: z.object({ file: z.enum(['swagger-ui.css', 'swagger-ui-bundle.js']) }) },
  responses: { 200: { description: 'Fichier CSS ou JavaScript' }, 404: { description: 'Fichier inconnu' } },
});

export function buildOpenApiDocument() {
  return new OpenApiGeneratorV3(registry.definitions).generateDocument({
    openapi: '3.0.3',
    info: {
      title: 'API LocalLoop',
      version: '0.1.0',
      description:
        'API du réseau social de proximité LocalLoop. Les erreurs suivent le format `application/problem+json` décrit dans ERRORS.md.',
    },
    servers: [{ url: '/' }],
  });
}
