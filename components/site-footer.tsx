import { Leaf } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t bg-card">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between lg:px-6">
        <div className="max-w-md">
          <div className="flex items-center gap-2">
            <Leaf className="size-4 text-primary" />
            <span className="font-serif text-sm font-semibold tracking-[0.12em] text-foreground">
              OPEN CIGAR DATABASE
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            A comprehensive, open-source database of cigars, built and verified
            by a global community to preserve, organize, study, and publish
            historical, agricultural, manufacturing, and product-identification
            information concerning cigars and related material culture. The
            project develops open technical standards and software for
            maintaining this information and makes its educational resources and
            datasets freely available to the public.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Catalog data licensed under CC BY 4.0.
          </p>
        </div>
        <div className="flex gap-12 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-medium">Explore</span>
            <Link
              className="text-muted-foreground hover:text-foreground"
              href="/catalog"
            >
              Catalog
            </Link>
            <Link
              className="text-muted-foreground hover:text-foreground"
              href="/catalog?sort=-reviews"
            >
              Top Rated
            </Link>
            <Link
              className="text-muted-foreground hover:text-foreground"
              href="/api-data"
            >
              API &amp; Data
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium">Project</span>
            <Link
              className="text-muted-foreground hover:text-foreground"
              href="/about"
            >
              About
            </Link>
            <Link
              className="text-muted-foreground hover:text-foreground"
              href="/contribute"
            >
              Contribute
            </Link>
            <Link
              className="text-muted-foreground hover:text-foreground"
              href="/community"
            >
              Community
            </Link>
            <Link
              className="text-muted-foreground hover:text-foreground"
              href="/support"
            >
              Support Us
            </Link>
            <Link
              className="text-muted-foreground hover:text-foreground"
              href="/ledger"
            >
              Public Ledger
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
