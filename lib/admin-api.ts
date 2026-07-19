import type { Cigar, Ledger, LedgerEntry } from "./api";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

export interface AdminLedgerEntry extends LedgerEntry {
  created_by: string;
  created_at: string;
  updated_by: string | null;
  updated_at: string | null;
}

export interface AdminLedger extends Ledger {
  entries: AdminLedgerEntry[];
}

export interface LedgerEntryInput {
  date: string;
  type: "income" | "expense";
  source: string;
  category: string;
  description: string;
  amount_usd: number;
  reference_url: string | null;
}

function adminToken(): string {
  const value = process.env.ADMIN_API_TOKEN;
  if (!value) {
    throw new Error(
      "ADMIN_API_TOKEN is not set. Add it to web/.env.local (see .env.local.example).",
    );
  }
  return value;
}

async function adminFetch<T>(
  path: string,
  adminUsername: string,
  init?: RequestInit,
): Promise<
  { ok: true; data: T } | { ok: false; status: number; message: string }
> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...init?.headers,
      authorization: `Bearer ${adminToken()}`,
      "x-admin-username": adminUsername,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    return {
      ok: false,
      status: res.status,
      message: body?.error?.message ?? "Request failed",
    };
  }
  if (res.status === 204) return { ok: true, data: undefined as T };
  return { ok: true, data: (await res.json()).data as T };
}

export function getAdminLedger(adminUsername: string) {
  return adminFetch<AdminLedger>("/v1/admin/ledger", adminUsername);
}

export function createLedgerEntry(
  input: LedgerEntryInput,
  adminUsername: string,
) {
  return adminFetch<AdminLedgerEntry>("/v1/admin/ledger", adminUsername, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
}

export function updateLedgerEntry(
  id: string,
  input: LedgerEntryInput,
  adminUsername: string,
) {
  return adminFetch<AdminLedgerEntry>(
    `/v1/admin/ledger/${encodeURIComponent(id)}`,
    adminUsername,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    },
  );
}

export function deleteLedgerEntry(id: string, adminUsername: string) {
  return adminFetch<void>(
    `/v1/admin/ledger/${encodeURIComponent(id)}`,
    adminUsername,
    {
      method: "DELETE",
    },
  );
}

export interface CigarUpdateInput {
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
}

export function updateCigar(
  id: string,
  input: CigarUpdateInput,
  adminUsername: string,
) {
  return adminFetch<Cigar>(
    `/v1/admin/cigars/${encodeURIComponent(id)}`,
    adminUsername,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    },
  );
}

export function mergeCigars(
  survivorId: string,
  duplicateId: string,
  adminUsername: string,
) {
  return adminFetch<Cigar>("/v1/admin/cigars/merge", adminUsername, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      survivor_id: survivorId,
      duplicate_id: duplicateId,
    }),
  });
}
