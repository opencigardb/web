import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <PlaceholderPage
      title="Sign up"
      blurb="Accounts are coming soon. The public catalog is fully browsable without one."
    />
  );
}
