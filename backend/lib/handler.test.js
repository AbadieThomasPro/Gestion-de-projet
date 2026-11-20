import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppError } from './errors';
import { withErrorHandler } from './handler';

const call = (handler) => withErrorHandler(handler)(new Request('http://localhost/api/test'), {});

afterEach(() => vi.restoreAllMocks());

describe('withErrorHandler', () => {
  it('hides an unexpected exception behind LL_INTERNAL_500 and logs it with the trace id', async () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});

    const res = await call(() => {
      throw new Error('connection to db.internal:5432 refused');
    });
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.code).toBe('LL_INTERNAL_500');
    expect(JSON.stringify(body)).not.toContain('db.internal');
    expect(body.stack).toBeUndefined();

    const entry = JSON.parse(logged.mock.calls[0][0]);
    expect(entry).toMatchObject({ level: 'error', traceId: body.traceId, path: '/api/test', status: 500 });
    expect(entry.error).toContain('db.internal');
  });

  it('keeps the status and detail of an AppError', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const res = await call(() => {
      throw new AppError('LL_EVENT_404', { detail: "L'événement 9999 n'existe pas." });
    });

    expect(res.status).toBe(404);
    expect(await res.json()).toMatchObject({ code: 'LL_EVENT_404', detail: "L'événement 9999 n'existe pas." });
  });
});

describe('AppError', () => {
  it('refuses an unknown code', () => {
    expect(() => new AppError('LL_NOPE')).toThrow('Unknown error code');
  });
});
