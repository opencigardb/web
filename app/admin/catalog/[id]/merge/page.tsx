import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { MergeIntoButton } from "@/components/merge-into-button";
import { getCigar, listCigars } from "@/lib/api";
import { countryName, formatLength } from "@/lib/format";

export const metadata: Metadata = { title: "Merge Cigar" };

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string }>;
}

export default async function MergeCigarPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { q } = await searchParams;

  const result = await getCigar(id);
  if (!result) notFound();
  if (result.canonicalId !== id)
    redirect(`/admin/catalog/${result.canonicalId}/merge`);
  const { cigar } = result;

  const candidates = q
    ? (await listCigars({ q, limit: 20 })).data.filter((c) => c.id !== id)
    : [];

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold">Merge Duplicate</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Find the cigar that should survive. <strong>{cigar.name}</strong> will
        be removed and its link will permanently redirect to whichever one you
        pick.
      </p>

      <div className="mt-6 rounded-xl border bg-card p-4 shadow-sm">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Being merged away
        </p>
        <p className="mt-1 font-medium">{cigar.name}</p>
        <p className="text-sm text-muted-foreground">
          {[cigar.brand, countryName(cigar.country)]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>

      <form method="GET" className="mt-6 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search for the surviving cigar…"
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
        />
        <button
          type="submit"
          className="h-10 shrink-0 rounded-lg border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-muted"
        >
          Search
        </button>
      </form>

      {q && (
        <ul className="mt-4 divide-y overflow-hidden rounded-xl border bg-card shadow-sm">
          {candidates.map((candidate) => (
            <li
              key={candidate.id}
              className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium">{candidate.name}</p>
                <p className="text-sm text-muted-foreground">
                  {[candidate.brand, countryName(candidate.country)]
                    .filter(Boolean)
                    .join(" · ")}
                  {candidate.length_in != null && candidate.ring_gauge != null
                    ? ` · ${formatLength(candidate.length_in)} × ${candidate.ring_gauge}`
                    : ""}
                </p>
              </div>
              <MergeIntoButton
                duplicateId={cigar.id}
                duplicateName={cigar.name}
                survivorId={candidate.id}
                survivorName={candidate.name}
              />
            </li>
          ))}
          {candidates.length === 0 && (
            <li className="px-4 py-10 text-center text-muted-foreground">
              No matches found.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
