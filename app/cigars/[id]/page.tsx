import {
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Copy,
  ExternalLink,
  Flag,
  Gauge,
  Globe,
  Mail,
  Pencil,
  PlusCircle,
  Ruler,
  Star,
  Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getCigar } from "@/lib/api";
import { countryName, formatLength, tobaccoOrigin } from "@/lib/format";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await getCigar((await params).id);
  return { title: result?.cigar.name ?? "Cigar not found" };
}

const CONTRIBUTE_ACTIONS = [
  { icon: PlusCircle, label: "Add a New Cigar" },
  { icon: Copy, label: "Report a Duplicate" },
  { icon: Globe, label: "Add a Source" },
  { icon: Wrench, label: "Request a Correction" },
];

const TABS = [
  "Details",
  "Variants",
  "Sources",
  "Reviews",
  "History",
  "Discussion",
];

function SpecItem({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Icon className="size-4 shrink-0 text-muted-foreground" />

      <div className="min-w-0">
        <p className="break-words text-sm font-semibold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function SpecRow({
  label,
  value,
  breakAll = false,
}: {
  label: string;
  value: string | null;
  breakAll?: boolean;
}) {
  if (!value) return null;

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 border-b border-border/70 py-2.5 text-sm last:border-0">
      <dt className="min-w-0 text-muted-foreground">{label}</dt>

      <dd
        className={`min-w-0 text-right font-medium ${
          breakAll ? "break-all" : "break-words"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export default async function CigarPage({ params }: Props) {
  const { id } = await params;
  const result = await getCigar(id);
  if (!result) notFound();
  if (result.canonicalId !== id) redirect(`/cigars/${result.canonicalId}`);
  const { cigar } = result;

  const dimensions =
    cigar.length_in != null && cigar.ring_gauge != null
      ? `${formatLength(cigar.length_in)} × ${cigar.ring_gauge}`
      : null;

  return (
    <main className="mx-auto w-full min-w-0 max-w-350 overflow-x-clip px-4 py-8 lg:px-6">
      <aside className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <section className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border bg-card shadow-lg">
            <div className="min-w-0 p-4 sm:p-6">
              <Link
                href="/catalog"
                className="flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronLeft className="size-4" /> Back to results
              </Link>

              <div className="mt-5 flex min-w-0 flex-col gap-6 sm:flex-row">
                <div className="flex h-56 w-full min-w-0 max-w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-secondary to-accent sm:w-56">
                  <CircleDot className="size-12 text-muted-foreground/40" />
                </div>

                <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div>
                      <h1 className="wrap-break-word text-2xl font-bold tracking-tight sm:text-3xl">
                        {cigar.name}
                      </h1>
                      {cigar.brand && (
                        <Link
                          href={`/catalog?brand=${encodeURIComponent(cigar.brand)}`}
                          className="mt-1 inline-block text-lg font-semibold text-primary hover:underline"
                        >
                          {cigar.brand}
                        </Link>
                      )}
                    </div>
                    <div className="rounded-lg border bg-background px-4 py-3 text-center">
                      <p className="flex items-center justify-center gap-1 text-2xl font-bold">
                        <Star className="size-5 fill-primary text-primary" />
                        {cigar.review_count}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {cigar.review_count === 1 ? "rating" : "ratings"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Badge variant="success">Active</Badge>
                    <Badge variant="info">Handmade</Badge>
                    {cigar.country && (
                      <Badge>{countryName(cigar.country)}</Badge>
                    )}
                    {cigar.color && <Badge variant="gold">{cigar.color}</Badge>}
                  </div>

                  <div className="mt-6 grid min-w-0 grid-cols-1 gap-x-4 gap-y-4 border-t pt-5 min-[360px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                    {" "}
                    {cigar.length_in != null && (
                      <SpecItem
                        icon={Ruler}
                        value={formatLength(cigar.length_in) ?? ""}
                        label="Length"
                      />
                    )}
                    {cigar.ring_gauge != null && (
                      <SpecItem
                        icon={Gauge}
                        value={String(cigar.ring_gauge)}
                        label="Ring Gauge"
                      />
                    )}
                    {cigar.strength && (
                      <SpecItem
                        icon={Star}
                        value={cigar.strength}
                        label="Strength"
                      />
                    )}
                    {cigar.country && (
                      <SpecItem
                        icon={Flag}
                        value={countryName(cigar.country) ?? ""}
                        label="Country"
                      />
                    )}
                    {cigar.color && (
                      <SpecItem
                        icon={CircleDot}
                        value={cigar.color}
                        label="Wrapper Color"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <nav
              className="flex w-full min-w-0 max-w-full gap-1 overflow-x-auto overscroll-x-contain border-t px-4 sm:px-6"
              aria-label="Cigar sections"
            >
              {TABS.map((tab, i) => (
                <span
                  key={tab}
                  className={
                    i === 0
                      ? "shrink-0 whitespace-nowrap border-b-2 border-primary px-3 py-3 text-sm font-medium text-foreground"
                      : "shrink-0 whitespace-nowrap cursor-not-allowed px-3 py-3 text-sm text-muted-foreground/60"
                  }
                  title={i === 0 ? undefined : "Coming soon"}
                >
                  {tab}
                </span>
              ))}
            </nav>

            <div className="grid min-w-0 grid-cols-1 gap-8 p-4 sm:p-6 md:grid-cols-2">
              <div className="min-w-0">
                <h2 className="font-semibold">Specifications</h2>
                <dl className="mt-2">
                  <SpecRow label="Brand" value={cigar.brand} />
                  <SpecRow label="Name" value={cigar.name} />
                  <SpecRow
                    label="Length"
                    value={
                      cigar.length_in != null
                        ? `${formatLength(cigar.length_in)} (${cigar.length_mm ?? Math.round(cigar.length_in * 25.4)} mm)`
                        : null
                    }
                  />
                  <SpecRow
                    label="Ring Gauge"
                    value={
                      cigar.ring_gauge != null ? String(cigar.ring_gauge) : null
                    }
                  />
                  <SpecRow label="Dimensions" value={dimensions} />
                </dl>
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold">Details</h2>
                <dl className="mt-2">
                  <SpecRow
                    label="Country of Origin"
                    value={countryName(cigar.country)}
                  />
                  <SpecRow
                    label="Wrapper"
                    value={tobaccoOrigin(cigar.wrapper)}
                  />
                  <SpecRow label="Filler" value={tobaccoOrigin(cigar.filler)} />
                  <SpecRow label="Wrapper Color" value={cigar.color} />
                  <SpecRow label="Strength" value={cigar.strength} />
                </dl>
              </div>
            </div>
          </section>
        </div>

        <aside className="min-w-0 space-y-6">
          <section className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Contribute</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Help make our database more accurate. Suggest edits, add missing
              cigars, or submit new information.
            </p>
            <Link
              href="/contribute"
              className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Pencil className="size-4" /> Suggest an Edit
            </Link>
            <ul className="mt-4 divide-y rounded-lg border">
              {CONTRIBUTE_ACTIONS.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <Link
                    href="/contribute"
                    className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted"
                  >
                    <Icon className="size-4 text-muted-foreground" />
                    <span className="flex-1">{label}</span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Quick Info</h2>
            <dl className="mt-2">
              <SpecRow label="Record ID" value={cigar.id} breakAll />
              <SpecRow label="Source Ref" value={cigar.source_ref} breakAll />
              <SpecRow label="License" value="CC BY 4.0" />
            </dl>
            {/*{cigar.source_url && (
              <a
                href={cigar.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex min-w-0 items-center gap-1.5 wrap-break-word text-sm font-medium text-primary hover:underline"
              >
                View original source <ExternalLink className="size-3.5" />
              </a>
            )}*/}
          </section>

          <section className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Share</h2>
            <div className="mt-3 flex gap-2">
              <a
                href={`mailto:?subject=${encodeURIComponent(cigar.name)}&body=${encodeURIComponent(`Check out ${cigar.name} on Open Cigar Database`)}`}
                aria-label="Share by email"
                className="flex size-10 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
              >
                <Mail className="size-4" />
              </a>
              <a
                href={`https://www.reddit.com/submit?title=${encodeURIComponent(cigar.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Reddit"
                className="flex size-10 items-center justify-center rounded-lg border transition-colors hover:bg-muted"
              >
                <ExternalLink className="size-4" />
              </a>
            </div>
          </section>
        </aside>
      </aside>
    </main>
  );
}
