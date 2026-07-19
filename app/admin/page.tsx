import { ArrowRight, ScrollText, ShieldCheck } from "lucide-react";
import Link from "next/link";

const UPCOMING = [
  {
    title: "Source Management",
    body: "Curate the sources backing each catalog record.",
  },
];

export default function AdminHome() {
  return (
    <div>
      <p className="text-muted-foreground">
        This is the foundation of the admin backend — authentication, ledger
        management, and catalog moderation are all live.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/ledger"
          className="group flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <ScrollText className="size-4 text-primary" />
          </span>
          <h2 className="mt-3 flex items-center gap-1 font-medium group-hover:text-primary">
            Ledger Entries <ArrowRight className="size-3.5" />
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add and edit public ledger transactions without touching JSON by
            hand.
          </p>
        </Link>
        <Link
          href="/admin/catalog"
          className="group flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <ShieldCheck className="size-4 text-primary" />
          </span>
          <h2 className="mt-3 flex items-center gap-1 font-medium group-hover:text-primary">
            Catalog Moderation <ArrowRight className="size-3.5" />
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fix bad data and merge duplicate cigar records.
          </p>
        </Link>
        {UPCOMING.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border bg-card p-5 opacity-70 shadow-sm"
          >
            <h2 className="font-medium">{item.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
