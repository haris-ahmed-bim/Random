import type { RequestHandler } from "@sveltejs/kit";
import { auth } from "@auth/sveltekit";
import { db, users } from "$lib/db";
import { eq } from "drizzle-orm";

export const PATCH: RequestHandler = async (event) => {
  const session = await auth(event);
  if (session?.user?.role !== "admin") return new Response("Forbidden", { status: 403 });
  const id = Number(event.params.id);
  const { role } = await event.request.json();
  if (!["user", "admin"].includes(role)) return new Response("Invalid role", { status: 400 });
  await db.update(users).set({ role }).where(eq(users.id, id));
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
