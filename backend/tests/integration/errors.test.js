import { beforeEach, describe, expect, it } from 'vitest';
import { POST as register } from '@/app/api/auth/register/route';
import { POST as login } from '@/app/api/auth/login/route';
import { GET as feed } from '@/app/api/posts/route';
import { DELETE as remove } from '@/app/api/posts/[id]/route';
import { GET as health } from '@/app/api/health/route';
import { createUser, firstZoneId, request, resetDb } from '../helpers';

beforeEach(resetDb);

const UUID = /^[0-9a-f-]{36}$/;

describe('error contract', () => {
  it('answers 401 LL_AUTH_401 in problem+json without token', async () => {
    const res = await feed(request('/api/posts'));
    const body = await res.json();

    expect(res.status).toBe(401);
    expect(res.headers.get('Content-Type')).toBe('application/problem+json');
    expect(body).toMatchObject({
      type: 'https://localloop.dev/errors/LL_AUTH_401',
      status: 401,
      code: 'LL_AUTH_401',
      title: 'Votre session a expiré, reconnectez-vous.',
      instance: '/api/posts',
    });
    expect(body.traceId).toMatch(UUID);
    expect(res.headers.get('X-Trace-Id')).toBe(body.traceId);
  });

  it('adds X-Trace-Id to successful responses too', async () => {
    const res = await health(request('/api/health'));
    expect(res.headers.get('X-Trace-Id')).toMatch(UUID);
  });

  it('lists every invalid field in a 422', async () => {
    const res = await register(
      request('/api/auth/register', { method: 'POST', body: { firstName: '', email: 'pas-un-email', password: '123' } })
    );
    const body = await res.json();

    expect(res.status).toBe(422);
    expect(body.code).toBe('LL_VALIDATION_422');
    expect(body.errors.map((e) => [e.field, e.code])).toEqual([
      ['firstName', 'REQUIRED'],
      ['lastName', 'REQUIRED'],
      ['email', 'INVALID_EMAIL'],
      ['password', 'TOO_SHORT'],
      ['zoneId', 'REQUIRED'],
    ]);
  });

  it('answers 422 to a body that is not JSON instead of a 500', async () => {
    const res = await register(
      new Request('http://localhost/api/auth/register', { method: 'POST', body: '{oops' })
    );
    const body = await res.json();

    expect(res.status).toBe(422);
    expect(body.errors[0]).toMatchObject({ field: 'body', code: 'INVALID_JSON' });
  });

  it('uses business codes: LL_EMAIL_409, LL_LOGIN_401, LL_POST_404', async () => {
    const { user, token } = await createUser();

    const duplicate = await register(
      request('/api/auth/register', {
        method: 'POST',
        body: { firstName: 'A', lastName: 'B', email: user.email, password: 'secret1', zoneId: await firstZoneId() },
      })
    );
    const badLogin = await login(
      request('/api/auth/login', { method: 'POST', body: { email: user.email, password: 'nope' } })
    );
    const missing = await remove(request('/api/posts/x', { method: 'DELETE', token }), { params: { id: 'x' } });

    expect((await duplicate.json()).code).toBe('LL_EMAIL_409');
    expect((await badLogin.json()).code).toBe('LL_LOGIN_401');
    expect((await missing.json()).code).toBe('LL_POST_404');
  });
});
