import {
  Code2,
  Globe2,
  Handshake,
  Heart,
  Receipt,
  ScrollText,
  Server,
  Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Support Open Cigar DB" };

const COSTS = [
  {
    icon: Server,
    title: "Hosting & Infrastructure",
    body: "Serving the API and website reliably at scale, including compute, storage, and bandwidth.",
  },
  {
    icon: Globe2,
    title: "Domain & Certificates",
    body: "Keeping opencigardb.com and its API subdomain registered, secure, and reachable.",
  },
  {
    icon: Wrench,
    title: "CI/CD & Tooling",
    body: "Automated testing, data validation, and build pipelines that keep the catalog trustworthy.",
  },
  {
    icon: Receipt,
    title: "Maintainer Time",
    body: "Reviewing contributions, resolving duplicates, and stewarding the data model and RFC process.",
  },
];

interface SupportOption {
  name: string;
  description: string;
  cadence: string;
  href: string | null;
  icon: React.ComponentType<{ className?: string }>;
}

const SUPPORT_OPTIONS: SupportOption[] = [
  {
    name: "GitHub Sponsors",
    description: "Recurring or one-time sponsorship, billed through GitHub.",
    cadence: "Monthly or one-time",
    href: "https://github.com/sponsors/opencigardb",
    icon: Code2,
  },
  {
    name: "Open Collective",
    description:
      "Recurring support with a fully public, itemized ledger of income and expenses.",
    cadence: "Monthly or one-time",
    href: "https://opencollective.com/opencigardb",
    icon: Handshake,
  },
  {
    name: "Patreon",
    description: "Ongoing monthly support for the project and its maintainers.",
    cadence: "Monthly",
    href: "https://www.patreon.com/opencigardb",
    icon: Heart,
  },
  {
    name: "One-time donation",
    description:
      "A single contribution via card or PayPal, no account required.",
    cadence: "One-time",
    href: null,
    icon: Receipt,
  },
];

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <div className="text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 mx-auto">
          <Heart className="size-7 text-primary" />
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
          Keep Open Cigar DB Free and Open
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          The catalog, the API, and the data are free for anyone to use,
          forever. Running the infrastructure behind them isn&apos;t — your
          support keeps it that way without ads, paywalls, or selling user data.
        </p>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">
          Where support goes
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {COSTS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex gap-3 rounded-xl border bg-card p-5 shadow-sm"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="size-4 text-primary" />
              </span>
              <div>
                <h3 className="font-medium">{title}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">
          Ways to contribute
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {SUPPORT_OPTIONS.map(
            ({ name, description, cadence, href, icon: Icon }) => {
              const content = (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </span>
                    {href ? (
                      <Badge variant="outline">{cadence}</Badge>
                    ) : (
                      <Badge variant="outline">Coming soon</Badge>
                    )}
                  </div>
                  <h3 className="mt-3 font-semibold">{name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </p>
                </>
              );

              if (!href) {
                return (
                  <div
                    key={name}
                    aria-disabled="true"
                    className="cursor-not-allowed rounded-xl border bg-card p-5 opacity-60 shadow-sm"
                  >
                    {content}
                  </div>
                );
              }

              return (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  {content}
                </a>
              );
            },
          )}
        </div>
      </section>

      <section className="mt-12 flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center shadow-sm sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <ScrollText className="size-5 text-primary" />
          </span>
          <div>
            <h2 className="font-semibold">See exactly where the money goes</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Every dollar in and out is recorded in our public ledger.
            </p>
          </div>
        </div>
        <Link
          href="/ledger"
          className="shrink-0 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          View Public Ledger
        </Link>
      </section>

      <section className="mt-6 rounded-xl border bg-card p-6 text-center shadow-sm">
        <h2 className="font-semibold">
          Every contribution matters, including your data
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Money isn&apos;t the only way to support the project. Correcting a
          record, adding a missing cigar, or citing a source helps just as much.
        </p>
        <Link
          href="/contribute"
          className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Contribute Data Instead
        </Link>
      </section>
    </main>
  );
}
