import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apparel & Print Size Guide | Bitium Technology",
  description: "Comprehensive print sizing guide for DTF sheets, screen printing dimensions, and stencil scales.",
  alternates: {
    canonical: "https://www.bitiumtechnology.com/size-guide",
  },
};

export default function SizeGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
