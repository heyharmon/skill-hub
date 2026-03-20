import type { APIRoute } from 'astro';
import { getFileContent } from '../../../../../lib/skills';

export const GET: APIRoute = ({ params }) => {
  const { name, path: filePath } = params;

  if (!name || !filePath) {
    return new Response(JSON.stringify({ error: 'Missing skill name or file path' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = getFileContent(name, filePath);

  if ('error' in result) {
    return new Response(JSON.stringify({ error: result.error }), {
      status: result.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  });
};
