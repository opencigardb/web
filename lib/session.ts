import { createHmac, timingSafeEqual } from "node:crypto";

export interface Session {
  adminId: string;
  username: string;
  expires: number;
}

function secret(): string {
  const value = process.env.SESSION_SECRET;
  if (!value) {
    throw new Error(
      "SESSION_SECRET is not set. Add it to web/.env.local (see .env.local.example).",
    );
  }
  return value;
}

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export const SESSION_COOKIE_NAME = "ocdb_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function createSessionCookieValue(
  adminId: string,
  username: string,
): string {
  const session: Session = {
    adminId,
    username,
    expires: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(session), "utf8").toString(
    "base64url",
  );
  return `${encoded}.${sign(encoded)}`;
}

export function verifySessionCookieValue(
  value: string | undefined | null,
): Session | null {
  if (!value) return null;
  const dot = value.indexOf(".");
  if (dot < 0) return null;

  const encoded = value.slice(0, dot);
  const signature = value.slice(dot + 1);
  const expected = sign(encoded);

  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (
    signatureBuf.length !== expectedBuf.length ||
    !timingSafeEqual(signatureBuf, expectedBuf)
  ) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as Session;
    if (Date.now() > session.expires) return null;
    return session;
  } catch {
    return null;
  }
}
