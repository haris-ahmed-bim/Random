import type { LayoutServerLoad } from './$types';
import { auth } from '@auth/sveltekit';

export const load: LayoutServerLoad = async (event) => {
  const session = await auth(event);
  return { session };
};
