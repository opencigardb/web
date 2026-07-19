"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import type { Cigar } from "@/lib/api";

const inputClass =
  "mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30";

export function CigarEditForm({ cigar }: { cigar: Cigar }) {
  const router = useRouter();
  const ids = {
    name: useId(),
    brand: useId(),
    lengthIn: useId(),
    lengthMm: useId(),
    ringGauge: useId(),
    country: useId(),
    filler: useId(),
    wrapper: useId(),
    color: useId(),
    strength: useId(),
  };
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    const optional = (key: string) => form.get(key)?.toString().trim() || null;
    const optionalNumber = (key: string) => {
      const value = optional(key);
      return value === null ? null : Number(value);
    };

    const payload = {
      name: form.get("name")?.toString().trim(),
      brand: optional("brand"),
      length_in: optionalNumber("length_in"),
      length_mm: optionalNumber("length_mm"),
      ring_gauge: optionalNumber("ring_gauge"),
      country: optional("country"),
      filler: optional("filler"),
      wrapper: optional("wrapper"),
      color: optional("color"),
      strength: optional("strength"),
    };

    try {
      const res = await fetch(`/api/admin/cigars/${cigar.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Something went wrong.");
        setPending(false);
        return;
      }
      router.push("/admin/catalog");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor={ids.name} className="block text-sm font-medium">
          Name
        </label>
        <input
          id={ids.name}
          name="name"
          type="text"
          required
          defaultValue={cigar.name}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor={ids.brand} className="block text-sm font-medium">
          Brand
        </label>
        <input
          id={ids.brand}
          name="brand"
          type="text"
          defaultValue={cigar.brand ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor={ids.lengthIn} className="block text-sm font-medium">
            Length (in)
          </label>
          <input
            id={ids.lengthIn}
            name="length_in"
            type="number"
            step="0.01"
            min="0"
            defaultValue={cigar.length_in ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={ids.lengthMm} className="block text-sm font-medium">
            Length (mm)
          </label>
          <input
            id={ids.lengthMm}
            name="length_mm"
            type="number"
            step="0.1"
            min="0"
            defaultValue={cigar.length_mm ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={ids.ringGauge} className="block text-sm font-medium">
            Ring Gauge
          </label>
          <input
            id={ids.ringGauge}
            name="ring_gauge"
            type="number"
            step="1"
            min="0"
            defaultValue={cigar.ring_gauge ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={ids.country} className="block text-sm font-medium">
            Country
          </label>
          <input
            id={ids.country}
            name="country"
            type="text"
            defaultValue={cigar.country ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={ids.strength} className="block text-sm font-medium">
            Strength
          </label>
          <input
            id={ids.strength}
            name="strength"
            type="text"
            defaultValue={cigar.strength ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor={ids.wrapper} className="block text-sm font-medium">
            Wrapper
          </label>
          <input
            id={ids.wrapper}
            name="wrapper"
            type="text"
            defaultValue={cigar.wrapper ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={ids.filler} className="block text-sm font-medium">
            Filler
          </label>
          <input
            id={ids.filler}
            name="filler"
            type="text"
            defaultValue={cigar.filler ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={ids.color} className="block text-sm font-medium">
            Wrapper Color
          </label>
          <input
            id={ids.color}
            name="color"
            type="text"
            defaultValue={cigar.color ?? ""}
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
          {pending ? "Saving…" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/catalog")}
          className="h-10 rounded-lg border border-border bg-background px-5 text-sm font-medium transition-colors hover:bg-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
