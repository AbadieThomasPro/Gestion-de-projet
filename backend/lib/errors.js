// Error codes of the API. The title is the message shown to the user: short, without technical words.
// Keep ERRORS.md up to date when a code is added.
export const ERRORS = {
  LL_VALIDATION_422: { status: 422, title: 'Certains champs sont invalides.' },
  LL_AUTH_401: { status: 401, title: 'Votre session a expiré, reconnectez-vous.' },
  LL_LOGIN_401: { status: 401, title: 'Email ou mot de passe incorrect.' },
  LL_AUTH_403: { status: 403, title: "Vous n'avez pas accès à ce contenu." },
  LL_POST_404: { status: 404, title: "Cette publication n'existe pas ou n'est plus disponible." },
  LL_USER_404: { status: 404, title: "Cet utilisateur n'existe pas." },
  LL_FRIEND_REQUEST_404: { status: 404, title: "Cette demande d'ami n'existe plus." },
  LL_FRIEND_REQUEST_409: { status: 409, title: "Une demande d'ami existe déjà avec cette personne." },
  LL_EMAIL_409: { status: 409, title: 'Cet email est déjà utilisé.' },
  LL_ZONE_404: { status: 404, title: "Cette zone n'existe pas ou n'est pas encore ouverte." },
  LL_EVENT_404: { status: 404, title: "Cet événement n'existe pas ou a été annulé." },
  LL_REPORT_409: { status: 409, title: 'Vous avez déjà signalé ce contenu.' },
  LL_RATE_429: { status: 429, title: 'Trop de tentatives, réessayez dans un instant.' },
  LL_INTERNAL_500: { status: 500, title: 'Une erreur est survenue de notre côté. Réessayez.' },
};

export const ERROR_TYPE_BASE = 'https://localloop.dev/errors/';

// Expected error, turned into an application/problem+json response by withErrorHandler.
// throw new AppError('LL_POST_404') or new AppError('LL_VALIDATION_422', { errors: [...] })
export class AppError extends Error {
  constructor(code, { detail, errors } = {}) {
    const definition = ERRORS[code];
    if (!definition) throw new Error(`Unknown error code ${code}`);

    super(detail || definition.title);
    this.name = 'AppError';
    this.code = code;
    this.status = definition.status;
    this.title = definition.title;
    this.detail = detail;
    this.errors = errors;
  }
}

// Body of an error response (RFC 7807 + business code), see EPIC Error management
export function problemBody(error, { instance, traceId }) {
  return {
    type: ERROR_TYPE_BASE + error.code,
    title: error.title,
    status: error.status,
    code: error.code,
    detail: error.detail || error.title,
    instance,
    traceId,
    ...(error.errors && { errors: error.errors }),
  };
}
