"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function MergeIntoButton({
  duplicateId,
  duplicateName,
  survivorId,
  survivorName,
}: {
  duplicateId: string;
  duplicateName: string;
  survivorId: string;
  survivorName: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    if (
      !confirm(
        `Merge "${duplicateName}" into "${survivorName}"? "${duplicateName}" will be removed; its link will permanently redirect to "${survivorName}". This can't be undone.`,
      )
    ) {
      return;
    }
    setPending(true);
    const res = await fetch("/api/admin/cigars/merge", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        survivor_id: survivorId,
        duplicate_id: duplicateId,
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      alert(body.error ?? "Failed to merge.");
      setPending(false);
      return;
    }
    router.push("/admin/catalog");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="shrink-0 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-60"
    >
      {pending ? "Merging…" : "Merge into this"}
    </button>
  );
}
