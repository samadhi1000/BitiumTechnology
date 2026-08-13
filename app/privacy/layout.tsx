import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Bitium Technology",
  description: "Privacy policy and data protection terms for Bitium Technology.",
  alternates: {
    canonical: "https://www.bitiumtechnology.com/privacy",
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
