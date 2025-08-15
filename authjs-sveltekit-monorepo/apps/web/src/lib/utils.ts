export function absoluteUrl(path: string) {
  const base = process.env.APP_BASE_URL || "http://localhost:5173";
  return new URL(path, base).toString();
}
export function minutesFromNow(mins: number) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + mins);
  return d;
}
export function randomToken() {
  return crypto.randomUUID().replace(/-/g, "") + Math.random().toString(36).slice(2);
}
