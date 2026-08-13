import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D T-Shirt & Apparel Customizer | Bitium Technology",
  description: "Preview your custom DTF transfers on realistic 3D t-shirt and apparel mockups before printing.",
  alternates: {
    canonical: "https://www.bitiumtechnology.com/3d-customizer",
  },
};

export default function CustomizerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
