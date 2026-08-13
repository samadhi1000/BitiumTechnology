import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Bitium Technology",
  description: "Terms and conditions of service for Bitium Technology.",
  alternates: {
    canonical: "https://www.bitiumtechnology.com/terms",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
