import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  type Session,
  verifySessionCookieValue,
} from "./session";

/** Server Component / Route Handler only — reads the signed session cookie. */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  return verifySessionCookieValue(cookieStore.get(SESSION_COOKIE_NAME)?.value);
}
