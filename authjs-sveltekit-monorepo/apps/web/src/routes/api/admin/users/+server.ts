import type { RequestHandler } from "@sveltejs/kit";
import { auth } from "@auth/sveltekit";
import { db } from "$lib/db";

export const GET: RequestHandler = async (event) => {
  const session = await auth(event);
  if (session?.user?.role !== "admin") return new Response("Forbidden", { status: 403 });
  const all = await db.query.users.findMany({ columns: { hashedPassword: false } });
  const total = all.length;
  const disabled = all.filter(u => u.disabled).length;
  return new Response(JSON.stringify({ users: all, stats: { total, disabled } }), { status: 200 });
};
