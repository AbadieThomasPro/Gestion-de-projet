import { withErrorHandler } from '@/lib/handler';
import { listZones } from '@/lib/zones';

// Neighbourhoods that can be chosen at registration (public: needed before having an account)
export const GET = withErrorHandler(async () => Response.json({ zones: await listZones() }));
