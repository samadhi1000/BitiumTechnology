import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DTF Canvas Builder | Bitium Technology",
  description: "Arrange artwork on custom DTF sheets online with real-time pricing and instant order generation.",
  alternates: {
    canonical: "https://www.bitiumtechnology.com/canvas",
  },
};

export default function CanvasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
