import type { RequestHandler } from "@sveltejs/kit";
import { db, users, verificationTokens } from "$lib/db";
import { SignupSchema } from "$lib/validators";
import bcrypt from "bcryptjs";
import { randomToken, absoluteUrl, minutesFromNow } from "$lib/utils";
import { sendMail } from "$lib/email/mailer";

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const parsed = SignupSchema.safeParse(body);
  if (!parsed.success) return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400 });

  const { name, email, password } = parsed.data;
  const existing = await db.query.users.findFirst({ where: (u, { eq }) => eq(u.email, email) });
  if (existing) return new Response(JSON.stringify({ error: "Email already registered" }), { status: 409 });

  const hashed = await bcrypt.hash(password, 10);
  const [u] = await db.insert(users).values({ name, email, hashedPassword: hashed }).returning();

  const token = randomToken();
  await db.insert(verificationTokens).values({ identifier: email, token, expires: minutesFromNow(60) });

  const verifyUrl = absoluteUrl(`/api/email/verify?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`);
  await sendMail(email, "Verify your email", `Click to verify: <a href="${verifyUrl}">${verifyUrl}</a>`);

  return new Response(JSON.stringify({ ok: true, userId: u.id }), { status: 201 });
};
