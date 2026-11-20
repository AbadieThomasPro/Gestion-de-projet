import { withErrorHandler } from '@/lib/handler';
import { buildOpenApiDocument } from '@/lib/openapi';

const document = buildOpenApiDocument();

// OpenAPI document of the API
export const GET = withErrorHandler(async () => Response.json(document));
