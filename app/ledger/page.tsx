import {
  ArrowDownCircle,
  ArrowUpCircle,
  Scale,
  ScrollText,
} from "lucide-react";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { getLedger, type Ledger } from "@/lib/api";
import { formatDate, formatDateTime, formatUSD } from "@/lib/format";

export const metadata: Metadata = { title: "Public Ledger" };

export default async function LedgerPage() {
  let ledger: Ledger | null = null;
  try {
    ledger = await getLedger();
  } catch {
    // API offline — render the page without live data.
  }

  const summary = ledger?.summary;

  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <div className="text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10">
          <ScrollText className="size-7 text-primary" />
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
          Public Ledger
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Every dollar Open Cigar DB receives and spends, recorded here. Nothing
          hidden, nothing summarized away.
        </p>
      </div>

      {summary && (
        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-5 text-center shadow-sm">
            <ArrowUpCircle className="mx-auto size-5 text-emerald-600 dark:text-emerald-400" />
            <p className="mt-2 text-2xl font-bold">
              {formatUSD(summary.total_income_usd)}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">Total raised</p>
          </div>
          <div className="rounded-xl border bg-card p-5 text-center shadow-sm">
            <ArrowDownCircle className="mx-auto size-5 text-destructive" />
            <p className="mt-2 text-2xl font-bold">
              {formatUSD(summary.total_expenses_usd)}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">Total spent</p>
          </div>
          <div className="rounded-xl border bg-card p-5 text-center shadow-sm">
            <Scale className="mx-auto size-5 text-primary" />
            <p className="mt-2 text-2xl font-bold">
              {formatUSD(summary.balance_usd)}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Current balance
            </p>
          </div>
        </section>
      )}

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Transactions</h2>
          {summary && (
            <p className="text-xs text-muted-foreground">
              Updated {formatDateTime(summary.updated_at)}
            </p>
          )}
        </div>

        {ledger && ledger.entries.length > 0 ? (
          <div className="mt-4">
            {/* Below sm: a table this narrow would clip the Balance column with
                no scroll affordance, so entries render as cards instead. */}
            <ul className="space-y-3 sm:hidden">
              {ledger.entries.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-xl border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{entry.source}</p>
                      <Badge variant="outline" className="mt-1">
                        {entry.category}
                      </Badge>
                    </div>
                    <p className="shrink-0 text-xs whitespace-nowrap text-muted-foreground">
                      {formatDate(entry.date)}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {entry.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t pt-2 text-sm">
                    <span
                      className={`font-medium ${
                        entry.type === "income"
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-destructive"
                      }`}
                    >
                      {entry.type === "income" ? "+" : "−"}
                      {formatUSD(entry.amount_usd)}
                    </span>
                    <span className="text-muted-foreground">
                      Balance:{" "}
                      <span className="font-medium text-foreground">
                        {formatUSD(entry.balance_usd)}
                      </span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="hidden overflow-x-auto rounded-xl border bg-card shadow-sm sm:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Source</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 text-right font-medium">Amount</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {ledger.entries.map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {formatDate(entry.date)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{entry.source}</p>
                        <Badge variant="outline" className="mt-1">
                          {entry.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {entry.description}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-medium whitespace-nowrap ${
                          entry.type === "income"
                            ? "text-emerald-700 dark:text-emerald-400"
                            : "text-destructive"
                        }`}
                      >
                        {entry.type === "income" ? "+" : "−"}
                        {formatUSD(entry.amount_usd)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium whitespace-nowrap">
                        {formatUSD(entry.balance_usd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border bg-card px-4 py-16 text-center text-muted-foreground shadow-sm">
            {ledger
              ? "No transactions yet. The first recorded contribution or expense will show up here."
              : "The ledger API is unavailable right now."}
          </div>
        )}

        <p className="mt-4 text-xs text-muted-foreground">
          This ledger is currently updated by hand after each real transaction.
          Automated syncing from our funding platforms is planned.
        </p>
      </section>
    </main>
  );
}
