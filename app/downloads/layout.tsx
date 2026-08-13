import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Vector & Stencil Downloads | Bitium Technology",
  description: "Download ready-to-cut vector stencil files, apparel artwork, and traditional Sri Lankan motifs.",
  alternates: {
    canonical: "https://www.bitiumtechnology.com/downloads",
  },
};

export default function DownloadsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
