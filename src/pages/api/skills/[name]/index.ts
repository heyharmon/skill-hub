import type { APIRoute } from 'astro';
import { getSkillDetail } from '../../../../lib/skills';

export const GET: APIRoute = ({ params }) => {
  const { name } = params;
  if (!name) {
    return new Response(JSON.stringify({ error: 'Missing skill name' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const detail = getSkillDetail(name);
  if (!detail) {
    return new Response(JSON.stringify({ error: 'Skill not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(detail), {
    headers: { 'Content-Type': 'application/json' },
  });
};
