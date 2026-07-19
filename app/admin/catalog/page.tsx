import type { Metadata } from "next";
import Link from "next/link";
import { listCigars } from "@/lib/api";
import { countryName, formatLength, formatNumber } from "@/lib/format";

export const metadata: Metadata = { title: "Catalog Moderation" };

const PAGE_SIZE = 25;

interface SearchParams {
  q?: string;
  page?: string;
}

function pageHref(q: string | undefined, page: number): string {
  const search = new URLSearchParams();
  if (q) search.set("q", q);
  if (page > 1) search.set("page", String(page));
  const qs = search.toString();
  return qs ? `/admin/catalog?${qs}` : "/admin/catalog";
}

export default async function AdminCatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const results = await listCigars({
    q: params.q,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });
  const { total } = results.pagination;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <p className="text-muted-foreground">
        Search the catalog to fix bad data or merge duplicate records. Changes
        apply to the live catalog immediately.
      </p>

      <form method="GET" action="/admin/catalog" className="mt-4 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={params.q ?? ""}
          placeholder="Search by name or brand…"
          className="h-10 w-full max-w-md rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
        />
        <button
          type="submit"
          className="h-10 rounded-lg border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-muted"
        >
          Search
        </button>
      </form>

      <p className="mt-4 text-sm text-muted-foreground">
        {formatNumber(total)} result{total === 1 ? "" : "s"}
        {totalPages > 1 ? ` · page ${page} of ${formatNumber(totalPages)}` : ""}
      </p>

      <ul className="mt-3 divide-y overflow-hidden rounded-xl border bg-card shadow-sm">
        {results.data.map((cigar) => (
          <li key={cigar.id}>
            <Link
              href={`/admin/catalog/${cigar.id}/edit`}
              className="flex flex-col gap-1 px-5 py-3 transition-colors hover:bg-muted/60 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium">{cigar.name}</p>
                <p className="text-sm text-muted-foreground">
                  {[cigar.brand, countryName(cigar.country)]
                    .filter(Boolean)
                    .join(" · ")}
                  {cigar.length_in != null && cigar.ring_gauge != null
                    ? ` · ${formatLength(cigar.length_in)} × ${cigar.ring_gauge}`
                    : ""}
                </p>
              </div>
              <span className="shrink-0 text-sm font-medium text-primary">
                Edit
              </span>
            </Link>
          </li>
        ))}
        {results.data.length === 0 && (
          <li className="px-5 py-16 text-center text-muted-foreground">
            No cigars match that search.
          </li>
        )}
      </ul>

      {totalPages > 1 && (
        <nav
          className="mt-4 flex items-center justify-center gap-2"
          aria-label="Pagination"
        >
          {page > 1 && (
            <Link
              href={pageHref(params.q, page - 1)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Previous
            </Link>
          )}
          {page < totalPages && (
            <Link
              href={pageHref(params.q, page + 1)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
