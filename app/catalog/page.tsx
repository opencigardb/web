import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { SearchForm } from "@/components/search-form";
import { Badge } from "@/components/ui/badge";
import {
  type Page as ApiPage,
  type Cigar,
  type Facet,
  getCountries,
  getStrengths,
  listCigars,
} from "@/lib/api";
import { countryName, formatLength, formatNumber } from "@/lib/format";

export const metadata: Metadata = { title: "Catalog" };

const PAGE_SIZE = 25;

interface CatalogSearchParams {
  q?: string;
  brand?: string;
  country?: string;
  strength?: string;
  sort?: string;
  page?: string;
}

function catalogHref(params: CatalogSearchParams, page: number): string {
  const search = new URLSearchParams();
  for (const key of ["q", "brand", "country", "strength", "sort"] as const) {
    if (params[key]) search.set(key, params[key]);
  }
  if (page > 1) search.set("page", String(page));
  const qs = search.toString();
  return qs ? `/catalog?${qs}` : "/catalog";
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  let results: ApiPage<Cigar> = {
    data: [],
    pagination: { total: 0, limit: PAGE_SIZE, offset: 0 },
  };
  let countries: Facet[] = [];
  let strengths: Facet[] = [];
  let apiError = false;
  try {
    [results, countries, strengths] = await Promise.all([
      listCigars({
        q: params.q,
        brand: params.brand,
        country: params.country,
        strength: params.strength,
        sort: params.sort,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      }),
      getCountries(),
      getStrengths(),
    ]);
  } catch {
    apiError = true;
  }

  const { total } = results.pagination;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-10 lg:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Catalog</h1>
      <p className="mt-1 text-muted-foreground">
        Browse and search the open cigar catalog.
      </p>

      <div className="mt-6 rounded-xl border bg-card p-4 shadow-sm">
        <SearchForm variant="hero" defaultValue={params.q ?? ""} />
        <form
          method="GET"
          action="/catalog"
          className="mt-3 flex flex-wrap items-center gap-2"
        >
          {params.q && <input type="hidden" name="q" value={params.q} />}
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <select
            name="country"
            defaultValue={params.country ?? ""}
            className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
          >
            <option value="">All countries</option>
            {countries.slice(0, 25).map((c) => (
              <option key={c.value} value={c.value}>
                {countryName(c.value)} ({formatNumber(c.count)})
              </option>
            ))}
          </select>
          <select
            name="strength"
            defaultValue={params.strength ?? ""}
            className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
          >
            <option value="">Any strength</option>
            {strengths.map((s) => (
              <option key={s.value} value={s.value}>
                {s.value} ({formatNumber(s.count)})
              </option>
            ))}
          </select>
          <select
            name="sort"
            defaultValue={params.sort ?? ""}
            className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
          >
            <option value="">
              Sort: {params.q ? "Relevance" : "Name A–Z"}
            </option>
            <option value="name">Name A–Z</option>
            <option value="-name">Name Z–A</option>
            <option value="-reviews">Most reviewed</option>
          </select>
          {params.brand && (
            <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-sm text-primary">
              Brand: {params.brand}
              <Link
                href={catalogHref({ ...params, brand: undefined }, 1)}
                className="-mr-1 ml-1 flex size-6 items-center justify-center rounded-full font-bold hover:bg-primary/20"
                aria-label="Clear brand filter"
              >
                ×
              </Link>
              <input type="hidden" name="brand" value={params.brand} />
            </span>
          )}
          <button
            type="submit"
            className="h-9 rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
          >
            Apply
          </button>
        </form>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {apiError
            ? "The catalog API is unavailable right now."
            : `${formatNumber(total)} result${total === 1 ? "" : "s"}${params.q ? ` for “${params.q}”` : ""}`}
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-muted-foreground">
            Page {page} of {formatNumber(totalPages)}
          </p>
        )}
      </div>

      <ul className="mt-3 divide-y overflow-hidden rounded-xl border bg-card shadow-sm">
        {results.data.map((cigar) => (
          <li key={cigar.id}>
            <Link
              href={`/cigars/${cigar.id}`}
              className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-muted/60 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium">{cigar.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {[cigar.brand, countryName(cigar.country)]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {cigar.strength && (
                  <Badge variant="gold">{cigar.strength}</Badge>
                )}
                {cigar.length_in != null && cigar.ring_gauge != null && (
                  <Badge variant="outline">
                    {formatLength(cigar.length_in)} × {cigar.ring_gauge}
                  </Badge>
                )}
                {cigar.review_count > 0 && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="size-3.5 fill-primary text-primary" />
                    {cigar.review_count}
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
        {!apiError && results.data.length === 0 && (
          <li className="px-5 py-16 text-center text-muted-foreground">
            No cigars match your search. Try a different term or clear the
            filters.
          </li>
        )}
      </ul>

      {totalPages > 1 && (
        <nav
          className="mt-6 flex items-center justify-center gap-2"
          aria-label="Pagination"
        >
          {page > 1 && (
            <Link
              href={catalogHref(params, page - 1)}
              className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              <ChevronLeft className="size-4" /> Previous
            </Link>
          )}
          {page < totalPages && (
            <Link
              href={catalogHref(params, page + 1)}
              className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Next <ChevronRight className="size-4" />
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
