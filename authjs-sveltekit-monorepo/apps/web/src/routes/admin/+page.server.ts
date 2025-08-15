import type { PageServerLoad } from './$types';
import { auth } from '@auth/sveltekit';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  const session = await auth(event);
  if (!session?.user) throw redirect(302, '/login');
  if (session.user.role !== 'admin') throw redirect(302, '/');
  const res = await event.fetch('/api/admin/users');
  const data = await res.json();
  return { ...data };
};
