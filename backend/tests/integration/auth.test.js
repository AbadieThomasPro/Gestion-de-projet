import { beforeEach, describe, expect, it } from 'vitest';
import { POST as register } from '@/app/api/auth/register/route';
import { POST as login } from '@/app/api/auth/login/route';
import { GET as me } from '@/app/api/auth/me/route';
import { createUser, firstZoneId, request, resetDb } from '../helpers';

beforeEach(resetDb);

describe('auth', () => {
  it('creates an account without sending back the password', async () => {
    const res = await register(
      request('/api/auth/register', {
        method: 'POST',
        body: {
          firstName: 'Chloé',
          lastName: 'Durand',
          email: ' Chloe@Test.dev ',
          password: 'secret1',
          zoneId: await firstZoneId(),
        },
      })
    );
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.token).toBeTruthy();
    expect(data.user).toMatchObject({ firstName: 'Chloé', email: 'chloe@test.dev', zoneName: 'Saint-Michel' });
    expect(data.user.password).toBeUndefined();
  });

  it('refuses an email already used', async () => {
    const body = { firstName: 'A', lastName: 'B', email: 'same@test.dev', password: 'secret1', zoneId: await firstZoneId() };
    await register(request('/api/auth/register', { method: 'POST', body }));
    const res = await register(request('/api/auth/register', { method: 'POST', body }));

    expect(res.status).toBe(409);
  });

  it('logs in with the right password only', async () => {
    const { user } = await createUser();

    const ok = await login(
      request('/api/auth/login', { method: 'POST', body: { email: user.email, password: 'secret1' } })
    );
    const ko = await login(
      request('/api/auth/login', { method: 'POST', body: { email: user.email, password: 'wrong' } })
    );

    expect(ok.status).toBe(200);
    expect(ko.status).toBe(401);
  });

  it('returns the logged user, 401 without token', async () => {
    const { token, user } = await createUser();

    expect((await (await me(request('/api/auth/me', { token }))).json()).user.id).toBe(user.id);
    expect((await me(request('/api/auth/me'))).status).toBe(401);
  });
});
