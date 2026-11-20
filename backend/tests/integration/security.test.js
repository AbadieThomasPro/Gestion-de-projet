import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it } from 'vitest';
import { getSecret } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GET as feed, POST as publish } from '@/app/api/posts/route';
import { createUser, request, resetDb } from '../helpers';

beforeEach(resetDb);

describe('JWT secret', () => {
  it('refuses a missing or default secret in production', () => {
    for (const JWT_SECRET of [undefined, 'change-me', 'dev-secret', 'too-short']) {
      expect(() => getSecret({ NODE_ENV: 'production', JWT_SECRET })).toThrow(/JWT_SECRET/);
    }
  });

  it('accepts a strong secret in production and a fallback in development', () => {
    expect(getSecret({ NODE_ENV: 'production', JWT_SECRET: 'x'.repeat(32) })).toBe('x'.repeat(32));
    expect(getSecret({ NODE_ENV: 'development' })).toBe('dev-secret');
  });
});

describe('invalid inputs never answer 500', () => {
  it('answers 401 to a token signed with another secret', async () => {
    const token = jwt.sign({ id: crypto.randomUUID() }, 'dev-secret');
    expect((await feed(request('/api/posts', { token }))).status).toBe(401);
  });

  it('answers 401 to a token whose id is not a UUID', async () => {
    const token = jwt.sign({ id: 'not-a-uuid' }, process.env.JWT_SECRET);
    expect((await feed(request('/api/posts', { token }))).status).toBe(401);
  });

  it('answers 401 when the account of the token was deleted', async () => {
    const { token, user } = await createUser();
    await prisma.user.delete({ where: { id: user.id } });

    const res = await publish(request('/api/posts', { method: 'POST', token, body: { content: 'Hello' } }));
    expect(res.status).toBe(401);
  });

  it('answers 422 to a body that is not an object', async () => {
    const { token } = await createUser();
    const res = await publish(request('/api/posts', { method: 'POST', token, body: ['x'] }));
    expect(res.status).toBe(422);
  });
});
