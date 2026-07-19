import type { Metadata } from "next";
import { LedgerEntryForm } from "@/components/ledger-entry-form";

export const metadata: Metadata = { title: "Add Ledger Entry" };

export default function NewLedgerEntryPage() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold">Add Transaction</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        This appears on the public ledger immediately.
      </p>
      <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
        <LedgerEntryForm mode="create" />
      </div>
    </div>
  );
}
