import type { RequestHandler } from "@sveltejs/kit";
import { db, users, passwordResetTokens } from "$lib/db";
import { ResetRequestSchema } from "$lib/validators";
import { eq } from "drizzle-orm";
import { randomToken, absoluteUrl, minutesFromNow } from "$lib/utils";
import { sendMail } from "$lib/email/mailer";

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const parsed = ResetRequestSchema.safeParse(body);
  if (!parsed.success) return new Response(JSON.stringify({ ok: true }), { status: 200 });

  const { email } = parsed.data;
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) return new Response(JSON.stringify({ ok: true }), { status: 200 });

  const token = randomToken();
  await db.insert(passwordResetTokens).values({ token, userId: user.id, expires: minutesFromNow(30) });

  const url = absoluteUrl(`/password-reset?token=${encodeURIComponent(token)}`);
  await sendMail(email, "Password reset request", `Reset your password: <a href="${url}">${url}</a>`);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
