const COUNTRY_NAMES: Record<string, string> = {
  DR: "Dominican Republic",
  NIC: "Nicaragua",
  HON: "Honduras",
  USA: "United States",
  CUB: "Cuba",
  MEX: "Mexico",
  CR: "Costa Rica",
  CRI: "Costa Rica",
  ECU: "Ecuador",
  BRA: "Brazil",
  PHI: "Philippines",
  PR: "Puerto Rico",
  PAN: "Panama",
  CI: "Canary Islands",
  COL: "Colombia",
  PER: "Peru",
  JAM: "Jamaica",
  IND: "Indonesia",
  CAM: "Cameroon",
  CT: "Connecticut (USA)",
  CTS: "Connecticut Shade",
  CTB: "Connecticut Broadleaf",
  HAB: "Habano",
  UND: "Undisclosed",
  GER: "Germany",
  HOL: "Netherlands",
  ITA: "Italy",
  SPA: "Spain",
  SWI: "Switzerland",
  BEL: "Belgium",
  DEN: "Denmark",
  IRE: "Ireland",
  CAN: "Canada",
};

export function countryName(code: string | null): string | null {
  if (!code) return null;
  return COUNTRY_NAMES[code] ?? code;
}

/** Tobacco origins arrive as codes like "CTS/ECU"; expand each part. */
export function tobaccoOrigin(value: string | null): string | null {
  if (!value) return null;
  return value
    .split("/")
    .map((part) => COUNTRY_NAMES[part.trim()] ?? part.trim())
    .join(" / ");
}

const SIXTEENTHS: Array<[number, string]> = [
  [0, ""],
  [2, " 1/8"],
  [4, " 1/4"],
  [6, " 3/8"],
  [8, " 1/2"],
  [10, " 5/8"],
  [12, " 3/4"],
  [14, " 7/8"],
];

/** 5.5 → `5 1/2"`, matching how cigar lengths are conventionally written. */
export function formatLength(inches: number | null): string | null {
  if (inches == null) return null;
  const whole = Math.floor(inches);
  const sixteenths = Math.round((inches - whole) * 16);
  if (sixteenths === 16) return `${whole + 1}"`;
  const fraction = SIXTEENTHS.reduce(
    (best, [n, label]) =>
      Math.abs(n - sixteenths) < Math.abs(best[0] - sixteenths)
        ? [n, label]
        : best,
    [0, ""] as [number, string],
  )[1];
  return `${whole}${fraction}"`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function formatUSD(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
