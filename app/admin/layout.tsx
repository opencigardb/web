import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Admin" },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Admin
          </p>
          <h1 className="text-xl font-semibold">
            Signed in as {session.username}
          </h1>
        </div>
        <LogoutButton />
      </div>
      <div className="mt-8">{children}</div>
    </main>
  );
}
