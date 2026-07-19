"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteLedgerEntryButton({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    if (!confirm(`Delete "${label}"? This can't be undone.`)) return;
    setPending(true);
    const res = await fetch(`/api/admin/ledger/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(body.error ?? "Failed to delete entry.");
      setPending(false);
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="text-sm font-medium text-destructive hover:underline disabled:opacity-60"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
