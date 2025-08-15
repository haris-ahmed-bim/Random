import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { SvelteKitAuthConfig } from "@auth/sveltekit";
import GitHub from "@auth/sveltekit/providers/github";
import Google from "@auth/sveltekit/providers/google";
import Credentials from "@auth/sveltekit/providers/credentials";
import { db, users, sessions, accounts, verificationTokens } from "$lib/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const authOptions: SvelteKitAuthConfig = {
  trustHost: true,
  session: {
    strategy: "database"
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    sessionsTable: sessions,
    accountsTable: accounts,
    verificationTokensTable: verificationTokens
  }) as any,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    }),
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!
    }),
    Credentials({
      authorize: async (creds) => {
        const parsed = credsSchema.safeParse(creds);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const [user] = await db.select().from(users).where(eq(users.email, email));
        if (!user || !user.hashedPassword) return null;
        if (user.disabled) return null;
        const valid = await bcrypt.compare(password, user.hashedPassword);
        if (!valid) return null;
        if (!user.emailVerified) return null;
        return { id: String(user.id), name: user.name ?? null, email: user.email, image: user.image ?? null };
      }
    })
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session && user) {
        (session as any).user.id = user.id;
        (session as any).user.role = (user as any).role;
        (session as any).user.disabled = (user as any).disabled;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/auth-error"
  },
  secret: process.env.AUTH_SECRET
};
