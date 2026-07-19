"use client";

import { ChevronDown, Leaf, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SearchForm } from "@/components/search-form";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "/catalog", label: "Catalog" },
  { href: "/contribute", label: "Contribute" },
  { href: "/community", label: "Community" },
  { href: "/api-data", label: "API & Data" },
  { href: "/support", label: "Support Us" },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-header text-header-foreground shadow-md">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-6 px-4 lg:px-6">
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-2.5 md:shrink-0"
          onClick={closeMobileMenu}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold/15">
            <Leaf className="size-5 text-gold" />
          </span>

          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate font-serif text-[15px] font-semibold tracking-[0.14em] text-gold">
              OPEN CIGAR DATABASE
            </span>

            <span className="hidden text-[11px] text-header-foreground/60 sm:block">
              The world&apos;s open source cigar catalog
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-header-foreground/80 transition-colors hover:bg-white/10 hover:text-header-foreground"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/about"
            className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-header-foreground/80 transition-colors hover:bg-white/10 hover:text-header-foreground"
          >
            About
            <ChevronDown className="size-3.5" />
          </Link>
        </nav>

        <div className="ml-auto hidden items-center gap-1 md:flex">
          <div className="hidden lg:block">
            <SearchForm variant="header" />
          </div>

          <ThemeToggle />

          <Link
            href="/login"
            className="rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-header-foreground transition-colors hover:bg-white/10"
          >
            Log in
          </Link>

          <Link
            href="/signup"
            className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Sign up
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-header-foreground transition-colors hover:bg-white/10 md:hidden"
          aria-label={
            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-white/10 bg-header px-4 pb-4 pt-3 md:hidden"
        >
          <div className="mb-3">
            <SearchForm variant="header" />
          </div>

          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-2.5 text-sm text-header-foreground/80 transition-colors hover:bg-white/10 hover:text-header-foreground"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/about"
              onClick={closeMobileMenu}
              className="rounded-lg px-3 py-2.5 text-sm text-header-foreground/80 transition-colors hover:bg-white/10 hover:text-header-foreground"
            >
              About
            </Link>
          </nav>

          <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4">
            <ThemeToggle />

            <Link
              href="/login"
              onClick={closeMobileMenu}
              className="flex-1 rounded-lg border border-white/20 px-3 py-2 text-center text-sm font-medium text-header-foreground transition-colors hover:bg-white/10"
            >
              Log in
            </Link>

            <Link
              href="/signup"
              onClick={closeMobileMenu}
              className="flex-1 rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
