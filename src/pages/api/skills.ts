import type { APIRoute } from 'astro';
import { listSkills } from '../../lib/skills';

export const GET: APIRoute = () => {
  const skills = listSkills();
  return new Response(JSON.stringify({ skills }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
