import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PlaceholderPage
      title="About Open Cigar Database"
      blurb="An open source, community-verified catalog of the world's cigars. Data is licensed CC BY 4.0 and served through a public REST API."
    />
  );
}
