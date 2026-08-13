import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Bitium Technology | Custom Printing & Laser Cut Studio",
  description: "Learn about Bitium Technology, a premium custom printing studio specializing in DTF transfers, stencils, and custom apparel printing in Sri Lanka.",
  alternates: {
    canonical: "https://www.bitiumtechnology.com/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
