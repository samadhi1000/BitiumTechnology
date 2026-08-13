import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Bitium Technology",
  description: "Get in touch with Bitium Technology for custom stencil, screen printing, and DTF printing inquiries in Sri Lanka.",
  alternates: {
    canonical: "https://www.bitiumtechnology.com/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
