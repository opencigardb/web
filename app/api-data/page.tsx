import { Code2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "API & Data" };

const ENDPOINTS = [
  [
    "GET /v1/cigars",
    "List and search cigars — supports q, brand, country, strength, sort, limit, offset",
  ],
  ["GET /v1/cigars/{id}", "Fetch a single cigar by its ULID"],
  ["GET /v1/brands", "Brands with cigar counts"],
  ["GET /v1/countries", "Country facet with counts"],
  ["GET /v1/strengths", "Strength facet with counts"],
  ["GET /v1/stats", "Catalog totals"],
];

export default function ApiDataPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <span className="flex size-14 items-center justify-center rounded-full bg-primary/10">
        <Code2 className="size-7 text-primary" />
      </span>
      <h1 className="mt-5 text-3xl font-bold tracking-tight">API &amp; Data</h1>
      <p className="mt-3 text-muted-foreground">
        The catalog is served by an open, read-only REST API. No authentication
        required. All catalog data is licensed CC BY 4.0.
      </p>
      <ul className="mt-8 divide-y rounded-xl border bg-card shadow-sm">
        {ENDPOINTS.map(([endpoint, description]) => (
          <li key={endpoint} className="px-5 py-4">
            <code className="font-mono text-sm font-semibold text-primary">
              {endpoint}
            </code>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-muted-foreground">
        Bulk downloads (JSON Lines, CSV, SQLite, Parquet) and generated SDKs are
        planned — see RFC-0004 in the project docs.
      </p>
    </main>
  );
}
