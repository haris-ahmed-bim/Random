import type { RequestHandler } from "@sveltejs/kit";
import { db, users, passwordResetTokens } from "$lib/db";
import { ResetConfirmSchema } from "$lib/validators";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const parsed = ResetConfirmSchema.safeParse(body);
  if (!parsed.success) return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });

  const { token, password } = parsed.data;
  const [row] = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token));
  if (!row) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 400 });
  if (row.expires < new Date() || row.used) return new Response(JSON.stringify({ error: "Token expired" }), { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  await db.update(users).set({ hashedPassword: hashed }).where(eq(users.id, row.userId));
  await db.update(passwordResetTokens).set({ used: true }).where(eq(passwordResetTokens.token, token));

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
