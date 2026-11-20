import { beforeEach, describe, expect, it } from 'vitest';
import { GET as received, POST as send } from '@/app/api/friends/requests/route';
import { PUT as accept } from '@/app/api/friends/requests/[id]/route';
import { GET as friends } from '@/app/api/friends/route';
import { GET as profile } from '@/app/api/users/[id]/route';
import { createUser, request, resetDb } from '../helpers';

beforeEach(resetDb);

describe('friends', () => {
  it('sends, accepts and lists a friend request', async () => {
    const alice = await createUser('Alice');
    const bob = await createUser('Bob');

    const sent = await send(
      request('/api/friends/requests', { method: 'POST', token: alice.token, body: { toId: bob.user.id } })
    );
    const { request: friendRequest } = await sent.json();
    expect(sent.status).toBe(201);

    const twice = await send(
      request('/api/friends/requests', { method: 'POST', token: alice.token, body: { toId: bob.user.id } })
    );
    expect(twice.status).toBe(400);

    const pending = (await (await received(request('/api/friends/requests', { token: bob.token }))).json()).requests;
    expect(pending[0].from.id).toBe(alice.user.id);

    await accept(request(`/api/friends/requests/${friendRequest.id}`, { method: 'PUT', token: bob.token }), {
      params: { id: friendRequest.id },
    });

    const list = (await (await friends(request('/api/friends', { token: alice.token }))).json()).friends;
    expect(list.map((f) => f.id)).toEqual([bob.user.id]);

    const page = await (
      await profile(request(`/api/users/${bob.user.id}`, { token: alice.token }), { params: { id: bob.user.id } })
    ).json();
    expect(page.friendStatus).toBe('friends');
  });

  it('returns 404 for an unknown user', async () => {
    const alice = await createUser();
    const res = await send(
      request('/api/friends/requests', { method: 'POST', token: alice.token, body: { toId: 'nope' } })
    );
    expect(res.status).toBe(404);
  });
});
