import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Community" };

export default function CommunityPage() {
  return (
    <PlaceholderPage
      title="Community"
      blurb="Discussions, reviews, and community governance are on the roadmap. In the meantime, explore the catalog and check back soon."
    />
  );
}
