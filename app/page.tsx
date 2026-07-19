import { ArrowRight, Database, Flag, Star, Tag } from "lucide-react";
import Link from "next/link";
import { SearchForm } from "@/components/search-form";
import { Badge } from "@/components/ui/badge";
import { type Cigar, getStats, listCigars, type Stats } from "@/lib/api";
import { countryName, formatLength, formatNumber } from "@/lib/format";

const POPULAR_SEARCHES = [
  "Padron 1964",
  "Cohiba Behike",
  "Romeo y Julieta",
  "Liga Privada",
  "Fuente OpusX",
];

export default async function Home() {
  let stats: Stats | null = null;
  let popular: Cigar[] = [];
  try {
    [stats, popular] = await Promise.all([
      getStats(),
      listCigars({ sort: "-reviews", limit: 6 }).then((page) => page.data),
    ]);
  } catch {
    // API offline — render the page without live data.
  }

  return (
    <main className="mx-auto max-w-350 px-4 py-12 lg:px-6">
      <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
        <section>
          <h1 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
            Open. Accurate. Community Driven.
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            A comprehensive, open source database of cigars built and verified
            by a global community.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Browse Catalog
            </Link>
            <Link
              href="/contribute"
              className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Contribute Now
            </Link>
          </div>
          {stats && (
            <dl className="mt-10 flex flex-wrap gap-8">
              {(
                [
                  [Database, formatNumber(stats.cigars), "Cigars"],
                  [Tag, formatNumber(stats.brands), "Brands"],
                  [Flag, formatNumber(stats.countries), "Countries"],
                ] as const
              ).map(([Icon, value, label]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </span>
                  <div>
                    <dd className="text-xl font-semibold">{value}</dd>
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                  </div>
                </div>
              ))}
            </dl>
          )}
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-sm">
          <SearchForm variant="hero" />
          <p className="mt-4 text-sm font-medium">Popular searches:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((term) => (
              <Link
                key={term}
                href={`/catalog?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-border bg-background px-3.5 py-1.5 text-sm transition-colors hover:border-primary/40 hover:text-primary"
              >
                {term}
              </Link>
            ))}
          </div>
        </section>
      </div>

      {popular.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              Most Reviewed
            </h2>
            <Link
              href="/catalog?sort=-reviews"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((cigar) => (
              <Link
                key={cigar.id}
                href={`/cigars/${cigar.id}`}
                className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold leading-snug group-hover:text-primary">
                      {cigar.name}
                    </h3>
                    {cigar.brand && (
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {cigar.brand}
                      </p>
                    )}
                  </div>
                  <span className="flex shrink-0 items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                    <Star className="size-3 fill-current" />
                    {cigar.review_count}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {cigar.strength && (
                    <Badge variant="gold">{cigar.strength}</Badge>
                  )}
                  {cigar.country && <Badge>{countryName(cigar.country)}</Badge>}
                  {cigar.length_in != null && cigar.ring_gauge != null && (
                    <Badge variant="outline">
                      {formatLength(cigar.length_in)} × {cigar.ring_gauge}
                    </Badge>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
