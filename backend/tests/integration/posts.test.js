import { beforeEach, describe, expect, it } from 'vitest';
import { GET as feed, POST as publish } from '@/app/api/posts/route';
import { DELETE as remove } from '@/app/api/posts/[id]/route';
import { POST as like } from '@/app/api/posts/[id]/like/route';
import { POST as comment } from '@/app/api/posts/[id]/comments/route';
import { GET as notifications } from '@/app/api/notifications/route';
import { GET as stats } from '@/app/api/users/[id]/stats/route';
import { createUser, request, resetDb } from '../helpers';

beforeEach(resetDb);

async function createPost(token, content = 'Bonjour le quartier') {
  const res = await publish(request('/api/posts', { method: 'POST', token, body: { content } }));
  return (await res.json()).post;
}

describe('posts', () => {
  it('publishes a post and shows it in the feed', async () => {
    const { token } = await createUser();
    const post = await createPost(token);

    const data = await (await feed(request('/api/posts', { token }))).json();

    expect(post.author.password).toBeUndefined();
    expect(data.posts.map((p) => p.id)).toEqual([post.id]);
    expect(data.hasMore).toBe(false);
  });

  it('refuses an empty post', async () => {
    const { token } = await createUser();
    const res = await publish(request('/api/posts', { method: 'POST', token, body: { content: '  ' } }));
    const body = await res.json();

    expect(res.status).toBe(422);
    expect(body.errors).toEqual([{ field: 'content', code: 'REQUIRED', message: 'La publication est vide.' }]);
  });

  it('paginates the feed by 10', async () => {
    const { token } = await createUser();
    for (let i = 0; i < 11; i += 1) await createPost(token, `post ${i}`);

    const page1 = await (await feed(request('/api/posts?page=1', { token }))).json();
    const page2 = await (await feed(request('/api/posts?page=2', { token }))).json();

    expect(page1.posts).toHaveLength(10);
    expect(page1.hasMore).toBe(true);
    expect(page2.posts).toHaveLength(1);
    expect(page2.hasMore).toBe(false);
  });

  it('counts likes and comments, and notifies the author', async () => {
    const author = await createUser('Author');
    const reader = await createUser('Reader');
    const post = await createPost(author.token);
    const params = { params: { id: post.id } };

    await like(request(`/api/posts/${post.id}/like`, { method: 'POST', token: reader.token }), params);
    await comment(
      request(`/api/posts/${post.id}/comments`, { method: 'POST', token: reader.token, body: { content: 'Top' } }),
      params
    );

    const [inFeed] = (await (await feed(request('/api/posts', { token: reader.token }))).json()).posts;
    expect(inFeed).toMatchObject({ likesCount: 1, likedByMe: true, commentsCount: 1 });

    const userStats = await (
      await stats(request(`/api/users/${author.user.id}/stats`, { token: reader.token }), {
        params: { id: author.user.id },
      })
    ).json();
    expect(userStats).toMatchObject({ posts: 1, likesReceived: 1, commentsReceived: 1, currentStreak: 1 });

    const list = (await (await notifications(request('/api/notifications', { token: author.token }))).json())
      .notifications;
    expect(list.map((n) => n.type).sort()).toEqual(['comment', 'like']);
  });

  it('unlikes on the second like', async () => {
    const { token } = await createUser();
    const post = await createPost(token);
    const params = { params: { id: post.id } };

    await like(request(`/api/posts/${post.id}/like`, { method: 'POST', token }), params);
    const data = await (await like(request(`/api/posts/${post.id}/like`, { method: 'POST', token }), params)).json();

    expect(data).toEqual({ liked: false, likesCount: 0 });
  });

  it('lets only the author delete a post', async () => {
    const author = await createUser();
    const other = await createUser();
    const post = await createPost(author.token);
    const params = { params: { id: post.id } };

    const forbidden = await remove(request(`/api/posts/${post.id}`, { method: 'DELETE', token: other.token }), params);
    const deleted = await remove(request(`/api/posts/${post.id}`, { method: 'DELETE', token: author.token }), params);
    const missing = await remove(request('/api/posts/x', { method: 'DELETE', token: author.token }), {
      params: { id: 'x' },
    });

    expect(forbidden.status).toBe(403);
    expect(deleted.status).toBe(200);
    expect(missing.status).toBe(404);
  });
});
