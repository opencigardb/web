"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { cn } from "@/lib/utils";

export function SearchForm({
  variant = "header",
  defaultValue = "",
}: {
  variant?: "header" | "hero";
  defaultValue?: string;
}) {
  const router = useRouter();
  const inputId = useId();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q =
      new FormData(event.currentTarget).get("q")?.toString().trim() ?? "";
    router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog");
  }

  if (variant === "hero") {
    return (
      <form
        onSubmit={onSubmit}
        className="flex w-full overflow-hidden rounded-lg border border-input bg-card shadow-sm focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30"
      >
        <label htmlFor={inputId} className="sr-only">
          Search the catalog
        </label>
        <Search className="my-auto ml-4 size-4 shrink-0 text-muted-foreground" />
        <input
          id={inputId}
          name="q"
          defaultValue={defaultValue}
          placeholder="Search for cigars, brands, lines, vitolas..."
          className="h-12 w-full bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="m-1 shrink-0 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-85"
        >
          Search
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3",
        "focus-within:border-white/30 focus-within:bg-white/15",
      )}
    >
      <label htmlFor={inputId} className="sr-only">
        Search the catalog
      </label>
      <Search className="size-4 shrink-0 text-header-foreground/50" />
      <input
        id={inputId}
        name="q"
        defaultValue={defaultValue}
        placeholder="Search cigars, brands, vitolas..."
        className="h-9 w-48 bg-transparent text-sm text-header-foreground outline-none placeholder:text-header-foreground/50 lg:w-56"
      />
      <kbd className="hidden rounded border border-white/15 px-1.5 py-0.5 text-[10px] text-header-foreground/50 lg:inline">
        ⌘K
      </kbd>
    </form>
  );
}
