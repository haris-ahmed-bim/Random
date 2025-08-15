import type { RequestHandler } from "@sveltejs/kit";
import { db, users, verificationTokens } from "$lib/db";
import { eq, and, gt } from "drizzle-orm";

export const GET: RequestHandler = async ({ url }) => {
  const token = url.searchParams.get("token");
  const email = url.searchParams.get("email");
  if (!token || !email) return new Response("Invalid", { status: 400 });

  const [row] = await db.select().from(verificationTokens).where(and(eq(verificationTokens.token, token), eq(verificationTokens.identifier, email)));
  if (!row) return new Response("Invalid token", { status: 400 });
  if (row.expires < new Date()) return new Response("Token expired", { status: 400 });

  await db.update(users).set({ emailVerified: new Date() }).where(eq(users.email, email));
  await db.delete(verificationTokens).where(eq(verificationTokens.token, token));

  return new Response("Email verified. You can close this tab and sign in.", { status: 200 });
};
