import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Log in" };

/** Only allow same-site relative paths, guarding against open-redirect via `?next=`. */
function safeNext(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//"))
    return "/admin";
  return value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const next = safeNext((await searchParams).next);

  const session = await getSession();
  if (session) redirect(next);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-bold tracking-tight">Admin log in</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Restricted to Open Cigar DB maintainers.
      </p>
      <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
        <LoginForm next={next} />
      </div>
    </main>
  );
}
