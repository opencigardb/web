import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createSessionCookieValue,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/session";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400 },
    );
  }

  let apiRes: Response;
  try {
    apiRes = await fetch(`${API_URL}/v1/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  } catch {
    return NextResponse.json(
      { error: "The API is unavailable right now." },
      { status: 502 },
    );
  }

  if (!apiRes.ok) {
    const status = apiRes.status === 429 ? 429 : 401;
    const message =
      status === 429
        ? "Too many attempts. Try again later."
        : "Invalid username or password.";
    return NextResponse.json({ error: message }, { status });
  }

  const { data } = (await apiRes.json()) as {
    data: { id: string; username: string };
  };

  const cookieStore = await cookies();
  cookieStore.set(
    SESSION_COOKIE_NAME,
    createSessionCookieValue(data.id, data.username),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    },
  );

  return NextResponse.json({ data: { username: data.username } });
}
