import type { Actions, PageServerLoad } from './$types';
import { auth } from '@auth/sveltekit';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
  const session = await auth(event);
  if (!session?.user) throw redirect(302, '/login');
  return { user: session.user };
};
