import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteLedgerEntryButton } from "@/components/delete-ledger-entry-button";
import { Badge } from "@/components/ui/badge";
import { getAdminLedger } from "@/lib/admin-api";
import { getSession } from "@/lib/auth";
import { formatDate, formatUSD } from "@/lib/format";

export const metadata: Metadata = { title: "Ledger Entries" };

export default async function AdminLedgerPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin/ledger");

  const result = await getAdminLedger(session.username);
  const entries = result.ok ? result.data.entries : [];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-muted-foreground">
          {result.ok
            ? `${entries.length} transaction${entries.length === 1 ? "" : "s"}. Changes go live on the public ledger immediately.`
            : `Couldn't load the ledger: ${result.message}`}
        </p>
        <Link
          href="/admin/ledger/new"
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" /> Add Transaction
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="mt-6 rounded-xl border bg-card px-4 py-16 text-center text-muted-foreground shadow-sm">
          No transactions yet.{" "}
          <Link
            href="/admin/ledger/new"
            className="text-primary hover:underline"
          >
            Add the first one
          </Link>
          .
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="rounded-xl border bg-card p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{entry.source}</p>
                    <Badge variant="outline">{entry.category}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {entry.description}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(entry.date)} · added by{" "}
                    {entry.created_by || "unknown"}
                    {entry.updated_by ? ` · edited by ${entry.updated_by}` : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={`font-medium ${
                      entry.type === "income"
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-destructive"
                    }`}
                  >
                    {entry.type === "income" ? "+" : "−"}
                    {formatUSD(entry.amount_usd)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Balance: {formatUSD(entry.balance_usd)}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 border-t pt-3">
                <Link
                  href={`/admin/ledger/${entry.id}/edit`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Edit
                </Link>
                <DeleteLedgerEntryButton
                  id={entry.id}
                  label={entry.description}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
