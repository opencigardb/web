import { Merge } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CigarEditForm } from "@/components/cigar-edit-form";
import { getCigar } from "@/lib/api";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = { title: "Edit Cigar" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCigarPage({ params }: Props) {
  const { id } = await params;
  const result = await getCigar(id);
  if (!result) notFound();
  if (result.canonicalId !== id)
    redirect(`/admin/catalog/${result.canonicalId}/edit`);
  const { cigar } = result;

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold">Edit Cigar</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {formatNumber(cigar.review_count)} review
        {cigar.review_count === 1 ? "" : "s"} · source: {cigar.source_name}
      </p>

      <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
        <CigarEditForm cigar={cigar} />
      </div>

      <div className="mt-6 flex items-center justify-between rounded-xl border bg-card p-5 shadow-sm">
        <div>
          <h3 className="font-medium">This is a duplicate</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Merge it into another cigar. This record's URL keeps working — it
            permanently redirects to the survivor.
          </p>
        </div>
        <Link
          href={`/admin/catalog/${cigar.id}/merge`}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          <Merge className="size-4" /> Merge
        </Link>
      </div>
    </div>
  );
}
