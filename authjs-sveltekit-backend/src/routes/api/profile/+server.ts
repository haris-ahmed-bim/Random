import type { RequestHandler } from "@sveltejs/kit";
import { auth } from "@auth/sveltekit";
import { db, users } from "$lib/db";
import { eq } from "drizzle-orm";
import { UpdateProfileSchema } from "$lib/validators";

export const GET: RequestHandler = async (event) => {
  const session = await auth(event);
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const [u] = await db.select().from(users).where(eq(users.id, Number(session.user.id)));
  return new Response(JSON.stringify({ user: { id: u.id, name: u.name, email: u.email, image: u.image, role: u.role, disabled: u.disabled } }), { status: 200 });
};

export const PUT: RequestHandler = async (event) => {
  const session = await auth(event);
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const body = await event.request.json();
  const parsed = UpdateProfileSchema.safeParse(body);
  if (!parsed.success) return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400 });

  await db.update(users).set({ ...parsed.data, updatedAt: new Date() }).where(eq(users.id, Number(session.user.id)));
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
