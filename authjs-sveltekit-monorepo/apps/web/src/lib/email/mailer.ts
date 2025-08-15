import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

export async function sendMail(to: string, subject: string, html: string) {
  const from = process.env.EMAIL_FROM || "no-reply@example.com";
  await transport.sendMail({ from, to, subject, html });
}
