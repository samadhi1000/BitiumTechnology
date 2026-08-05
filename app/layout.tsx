import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PreloaderWrapper from "@/components/PreloaderWrapper";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const poppins = Poppins({ weight: ["400", "500", "600", "700", "800", "900"], subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "Bitium Technology - High-Performance Custom DTF Sheet Builder",
  description: "Create, customize, and order premium DTF prints and apparel online with Bitium Technology.",
  keywords: "DTF prints, apparel, t-shirt design, custom printing, virtual canvas, fabricjs, next.js, Bitium Technology",
  authors: [{ name: "Bitium Technology" }],
  openGraph: {
    title: "Bitium Technology - High-Performance Custom DTF Sheet Builder",
    description: "Create, customize, and order premium DTF prints and apparel online with Bitium Technology.",
    url: "https://www.bitiumtechnology.com",
    siteName: "Bitium Technology",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 675, // Aspect ratio 16:9 for our generated image
        alt: "Bitium Technology - Custom Printing & DTF Visualizer Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitium Technology - High-Performance Custom DTF Sheet Builder",
    description: "Create, customize, and order premium DTF prints and apparel online with Bitium Technology.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased dark ${inter.variable} ${poppins.variable}`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-primary/40 selection:text-primary-foreground">
        <ThemeProvider>
          <PreloaderWrapper>
            <AuthProvider>
              <Navbar />
              <main className="flex-grow flex flex-col">{children}</main>
              <Footer />
              <CartDrawer />
            </AuthProvider>
          </PreloaderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
