import { AppError, problemBody } from './errors';
import { isForeignKeyViolation } from './prisma';

export const TRACE_HEADER = 'X-Trace-Id';

function log(level, entry) {
  // One JSON line per event: easy to search by traceId
  console[level](JSON.stringify({ time: new Date().toISOString(), level, ...entry }));
}

// Wraps a route handler: every response gets an X-Trace-Id header, AppError becomes a
// problem+json response and an unexpected exception becomes a 500 without internal details.
export function withErrorHandler(handler) {
  return async function route(request, context) {
    const traceId = crypto.randomUUID();
    const { pathname } = new URL(request.url);

    try {
      const response = await handler(request, context);
      response.headers.set(TRACE_HEADER, traceId);
      return response;
    } catch (caught) {
      // The only foreign keys written from the token are the user ids: the account no longer exists
      const error =
        caught instanceof AppError
          ? caught
          : isForeignKeyViolation(caught)
            ? new AppError('LL_AUTH_401')
            : new AppError('LL_INTERNAL_500');
      const entry = { traceId, method: request.method, path: pathname, status: error.status, code: error.code };

      if (error.status >= 500) {
        log('error', { ...entry, error: caught?.message, stack: caught?.stack });
      } else {
        log('warn', entry);
      }

      return Response.json(problemBody(error, { instance: pathname, traceId }), {
        status: error.status,
        headers: { 'Content-Type': 'application/problem+json', [TRACE_HEADER]: traceId },
      });
    }
  };
}
