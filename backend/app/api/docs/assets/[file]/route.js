import fs from 'fs/promises';
import path from 'path';
import { getAbsoluteFSPath } from 'swagger-ui-dist';
import { withErrorHandler } from '@/lib/handler';

// Only these files of swagger-ui-dist are served (no path given by the client reaches the disk)
const FILES = {
  'swagger-ui.css': 'text/css; charset=utf-8',
  'swagger-ui-bundle.js': 'text/javascript; charset=utf-8',
};

// Files of Swagger UI, served by the API so the doc works without internet access
export const GET = withErrorHandler(async (request, { params }) => {
  const type = FILES[params.file];
  if (!type) return new Response('Not found', { status: 404 });

  const content = await fs.readFile(path.join(getAbsoluteFSPath(), params.file));
  return new Response(content, {
    headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=86400' },
  });
});
