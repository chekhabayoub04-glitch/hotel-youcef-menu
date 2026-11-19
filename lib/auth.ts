import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "hy_admin";
const password = () => process.env.ADMIN_PASSWORD || "youcef2026";
const secret = () => process.env.ADMIN_SECRET || "hotel-youcef-demo-secret";

const token = () => createHmac("sha256", secret()).update(`admin:${password()}`).digest("hex");

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export const checkPassword = (input: string) => safeEqual(input, password());
export const sessionToken = token;

export async function isAuthed() {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  return !!value && safeEqual(value, token());
}
