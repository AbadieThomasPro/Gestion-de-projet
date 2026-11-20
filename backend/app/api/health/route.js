import { withErrorHandler } from '@/lib/handler';

// Check that the API is running
export const GET = withErrorHandler(async () => Response.json({ status: 'ok' }));
