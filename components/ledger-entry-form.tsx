"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";

export interface LedgerFormInitial {
  date: string;
  type: "income" | "expense";
  source: string;
  category: string;
  description: string;
  amount_usd: number;
  reference_url: string | null;
}

interface Props {
  mode: "create" | "edit";
  entryId?: string;
  initial?: LedgerFormInitial;
}

const inputClass =
  "mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30";

export function LedgerEntryForm({ mode, entryId, initial }: Props) {
  const router = useRouter();
  const ids = {
    date: useId(),
    type: useId(),
    source: useId(),
    category: useId(),
    description: useId(),
    amount: useId(),
    referenceUrl: useId(),
  };
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    const referenceUrl = form.get("reference_url")?.toString().trim();
    const payload = {
      date: form.get("date"),
      type: form.get("type"),
      source: form.get("source"),
      category: form.get("category"),
      description: form.get("description"),
      amount_usd: Number(form.get("amount_usd")),
      reference_url: referenceUrl || null,
    };

    const url =
      mode === "create" ? "/api/admin/ledger" : `/api/admin/ledger/${entryId}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Something went wrong.");
        setPending(false);
        return;
      }
      router.push("/admin/ledger");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={ids.date} className="block text-sm font-medium">
            Date
          </label>
          <input
            id={ids.date}
            name="date"
            type="date"
            required
            defaultValue={initial?.date}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={ids.type} className="block text-sm font-medium">
            Type
          </label>
          <select
            id={ids.type}
            name="type"
            required
            defaultValue={initial?.type ?? "income"}
            className={inputClass}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={ids.source} className="block text-sm font-medium">
            Source
          </label>
          <input
            id={ids.source}
            name="source"
            type="text"
            required
            placeholder="Open Collective"
            defaultValue={initial?.source}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={ids.category} className="block text-sm font-medium">
            Category
          </label>
          <input
            id={ids.category}
            name="category"
            type="text"
            required
            placeholder="Sponsorship, Hosting, Domain…"
            defaultValue={initial?.category}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor={ids.description} className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id={ids.description}
          name="description"
          required
          rows={3}
          defaultValue={initial?.description}
          className={`${inputClass} h-auto py-2`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={ids.amount} className="block text-sm font-medium">
            Amount (USD)
          </label>
          <input
            id={ids.amount}
            name="amount_usd"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={initial?.amount_usd}
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor={ids.referenceUrl}
            className="block text-sm font-medium"
          >
            Reference URL{" "}
            <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id={ids.referenceUrl}
            name="reference_url"
            type="url"
            placeholder="https://…"
            defaultValue={initial?.reference_url ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="h-10 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending
            ? "Saving…"
            : mode === "create"
              ? "Add Entry"
              : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/ledger")}
          className="h-10 rounded-lg border border-border bg-background px-5 text-sm font-medium transition-colors hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
