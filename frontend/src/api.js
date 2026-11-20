const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Error of the API, built from its application/problem+json body (see ERRORS.md)
export class ApiError extends Error {
  constructor({ code, status, title, errors = [], traceId }) {
    // First field message for a 422, otherwise the message of the catalogue
    super(errors[0]?.message || title);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.errors = errors;
    this.traceId = traceId;
  }
}

const NETWORK_ERROR = { code: 'LL_NETWORK', status: 0, title: 'Connexion perdue. Vérifiez votre réseau.' };
const UNKNOWN_ERROR = { code: 'LL_INTERNAL_500', title: 'Une erreur est survenue de notre côté. Réessayez.' };

export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');

  let res;
  try {
    res = await fetch(API_URL + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(NETWORK_ERROR);
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError({
      ...UNKNOWN_ERROR,
      status: res.status,
      traceId: res.headers.get('X-Trace-Id'),
      ...(data?.code && data),
    });
  }
  return data;
}
