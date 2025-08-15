import { SvelteKitAuth } from "@auth/sveltekit";
import { authOptions } from "$lib/auth";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = SvelteKitAuth(authOptions);
