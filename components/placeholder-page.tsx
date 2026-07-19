import { Construction } from "lucide-react";
import Link from "next/link";

export function PlaceholderPage({
  title,
  blurb,
}: {
  title: string;
  blurb: string;
}) {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-primary/10">
        <Construction className="size-7 text-primary" />
      </span>
      <h1 className="mt-5 text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-3 text-muted-foreground">{blurb}</p>
      <Link
        href="/catalog"
        className="mt-8 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Browse the Catalog
      </Link>
    </main>
  );
}
