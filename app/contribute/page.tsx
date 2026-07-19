import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Contribute" };

export default function ContributePage() {
  return (
    <PlaceholderPage
      title="Contribute"
      blurb="Contributor workflows — suggesting edits, adding cigars, and submitting sources — are coming soon. The catalog is community-driven; every correction makes it better."
    />
  );
}
