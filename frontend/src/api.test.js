import { afterEach, describe, expect, it, vi } from 'vitest';
import { api, ApiError } from './api';

function mockFetch(implementation) {
  vi.stubGlobal('fetch', vi.fn(implementation));
}

afterEach(() => vi.unstubAllGlobals());

describe('api', () => {
  it('returns the JSON of a successful response', async () => {
    mockFetch(async () => new Response(JSON.stringify({ status: 'ok' }), { status: 200 }));

    expect(await api('/health')).toEqual({ status: 'ok' });
  });

  it('turns a problem+json response into an ApiError with the field message', async () => {
    const problem = {
      code: 'LL_VALIDATION_422',
      status: 422,
      title: 'Certains champs sont invalides.',
      traceId: 'abc',
      errors: [{ field: 'content', code: 'REQUIRED', message: 'La publication est vide.' }],
    };
    mockFetch(async () => new Response(JSON.stringify(problem), { status: 422 }));

    const error = await api('/posts', { method: 'POST', body: {} }).catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ code: 'LL_VALIDATION_422', status: 422, traceId: 'abc' });
    expect(error.message).toBe('La publication est vide.');
  });

  it('never shows a technical message when the body is not JSON', async () => {
    mockFetch(async () => new Response('<html>Bad gateway</html>', { status: 502 }));

    const error = await api('/posts').catch((e) => e);

    expect(error).toMatchObject({ code: 'LL_INTERNAL_500', status: 502 });
    expect(error.message).toBe('Une erreur est survenue de notre côté. Réessayez.');
  });

  it('returns LL_NETWORK when the API does not answer', async () => {
    mockFetch(async () => {
      throw new TypeError('Failed to fetch');
    });

    const error = await api('/posts').catch((e) => e);

    expect(error.code).toBe('LL_NETWORK');
    expect(error.message).toBe('Connexion perdue. Vérifiez votre réseau.');
  });
});
