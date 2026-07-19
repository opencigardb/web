import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { LedgerEntryForm } from "@/components/ledger-entry-form";
import { getAdminLedger } from "@/lib/admin-api";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Edit Ledger Entry" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditLedgerEntryPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin/ledger");

  const { id } = await params;
  const result = await getAdminLedger(session.username);
  const entry = result.ok
    ? result.data.entries.find((e) => e.id === id)
    : undefined;
  if (!entry) notFound();

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold">Edit Transaction</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Added {entry.created_by ? `by ${entry.created_by} ` : ""}
        on {new Date(entry.created_at).toLocaleDateString("en-US")}.
      </p>
      <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
        <LedgerEntryForm
          mode="edit"
          entryId={entry.id}
          initial={{
            date: entry.date,
            type: entry.type,
            source: entry.source,
            category: entry.category,
            description: entry.description,
            amount_usd: entry.amount_usd,
            reference_url: entry.reference_url,
          }}
        />
      </div>
    </div>
  );
}
