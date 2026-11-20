import { withErrorHandler } from '@/lib/handler';

const SWAGGER_UI = '/api/docs/assets';

const page = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>API LocalLoop - Swagger</title>
    <link rel="stylesheet" href="${SWAGGER_UI}/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="${SWAGGER_UI}/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({ url: '/api/openapi.json', dom_id: '#swagger-ui', persistAuthorization: true });
    </script>
  </body>
</html>`;

// Swagger UI
export const GET = withErrorHandler(async () => new Response(page, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }));
