import { z } from "zod";
export const SignupSchema = z.object({ name: z.string().min(1).max(80), email: z.string().email(), password: z.string().min(6).max(100) });
export const UpdateProfileSchema = z.object({ name: z.string().min(1).max(80).optional(), image: z.string().url().optional() });
export const ResetRequestSchema = z.object({ email: z.string().email() });
export const ResetConfirmSchema = z.object({ token: z.string(), password: z.string().min(6).max(100) });
