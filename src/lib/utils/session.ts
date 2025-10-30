import { cookies } from "next/headers";
// Returns the session object (userId, email) or null
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    return { userId: payload.id, email: payload.email };
  } catch {
    return null;
  }
}

// Clears the session cookie
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', { ...COOKIE_OPTIONS, maxAge: 0 });
}
// Returnează userul din sesiunea curentă (sau null)
export async function getUserFromRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return getUserFromToken(token);
}
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const COOKIE_NAME = "session";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 zile
};

export function createSessionCookie(user: { id: string; email: string }) {
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  return {
    name: COOKIE_NAME,
    value: token,
    options: COOKIE_OPTIONS,
  };
}

export function getUserFromToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
