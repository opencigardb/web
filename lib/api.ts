const API_URL = process.env.API_URL ?? "http://localhost:3001";

export interface Cigar {
  id: string;
  name: string;
  brand: string | null;
  length_in: number | null;
  length_mm: number | null;
  ring_gauge: number | null;
  country: string | null;
  filler: string | null;
  wrapper: string | null;
  color: string | null;
  strength: string | null;
  review_count: number;
  source_name: string;
  source_ref: string | null;
  source_url: string | null;
}

export interface Brand {
  name: string;
  cigar_count: number;
  countries: string | null;
}

export interface Facet {
  value: string;
  count: number;
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
}

export interface Page<T> {
  data: T[];
  pagination: Pagination;
}

export interface Stats {
  cigars: number;
  brands: number;
  countries: number;
  ingested_at: string | null;
}

export interface LedgerEntry {
  id: string;
  date: string;
  type: "income" | "expense";
  source: string;
  category: string;
  description: string;
  amount_usd: number;
  reference_url: string | null;
  balance_usd: number;
}

export interface LedgerSummary {
  total_income_usd: number;
  total_expenses_usd: number;
  balance_usd: number;
  currency: string;
  entry_count: number;
  updated_at: string;
}

export interface Ledger {
  entries: LedgerEntry[];
  summary: LedgerSummary;
}

async function get<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const url = new URL(path, API_URL);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== "")
      url.searchParams.set(key, String(value));
  }
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `API ${res.status} for ${url.pathname}: ${body.slice(0, 200)}`,
    );
  }
  return res.json() as Promise<T>;
}

export interface CigarListQuery {
  q?: string;
  brand?: string;
  country?: string;
  strength?: string;
  color?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

export function listCigars(query: CigarListQuery = {}): Promise<Page<Cigar>> {
  return get("/v1/cigars", { ...query });
}

export interface CigarLookup {
  cigar: Cigar;
  /** Differs from the requested id when it was merged away (OCP-0005). */
  canonicalId: string;
}

export async function getCigar(id: string): Promise<CigarLookup | null> {
  const url = new URL(`/v1/cigars/${encodeURIComponent(id)}`, API_URL);
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const body = (await res.json()) as { data: Cigar };
    // Next's fetch-caching wrapper always resets `redirected` to false on
    // the reconstructed Response, but reliably preserves `url` — so derive
    // the canonical id from the final URL instead of the redirected flag.
    const canonicalId = new URL(res.url).pathname.split("/").pop() ?? id;
    return { cigar: body.data, canonicalId };
  } catch {
    return null;
  }
}

export function listBrands(
  query: { q?: string; limit?: number; offset?: number } = {},
): Promise<Page<Brand>> {
  return get("/v1/brands", { ...query });
}

export async function getCountries(): Promise<Facet[]> {
  return (await get<{ data: Facet[] }>("/v1/countries")).data;
}

export async function getStrengths(): Promise<Facet[]> {
  return (await get<{ data: Facet[] }>("/v1/strengths")).data;
}

export async function getStats(): Promise<Stats> {
  return (await get<{ data: Stats }>("/v1/stats")).data;
}

export async function getLedger(): Promise<Ledger> {
  return (await get<{ data: Ledger }>("/v1/ledger")).data;
}
