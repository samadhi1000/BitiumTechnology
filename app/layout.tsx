import type { Metadata } from "next";
import { Noto_Sans_Sinhala, Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import { LanguageProvider } from "@/lib/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PreloaderWrapper from "@/components/PreloaderWrapper";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";

const notoSansSinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala", "latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-sinhala",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bitiumtechnology.com"),
  title: "Custom DTF Printing & Gang Sheets | Bitium Technology",
  description: "Design your own DTF transfers online, preview them in 3D, and get vibrant, durable prints shipped in 24 hours. No minimum orders. Try Bitium today.",
  keywords: "DTF prints, apparel, t-shirt design, custom printing, virtual canvas, fabricjs, next.js, Bitium Technology",
  authors: [{ name: "Bitium Technology" }],
  alternates: {
    canonical: "https://www.bitiumtechnology.com/",
  },
  openGraph: {
    title: "Custom DTF Printing & Gang Sheets | Bitium Technology",
    description: "Design your own DTF transfers online, preview them in 3D, and get vibrant, durable prints shipped in 24 hours. No minimum orders. Try Bitium today.",
    url: "https://www.bitiumtechnology.com/",
    siteName: "Bitium Technology",
    images: [
      {
        url: "/images/og-bitium.webp",
        width: 1200,
        height: 630,
        alt: "Bitium Technology - Professional DTF & Laser Printing",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom DTF Printing & Gang Sheets | Bitium Technology",
    description: "Design your own DTF transfers online, preview them in 3D, and get vibrant, durable prints shipped in 24 hours. No minimum orders. Try Bitium today.",
    images: ["/images/og-bitium.webp"],
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
      className={`h-full antialiased dark ${inter.variable} ${outfit.variable} ${notoSansSinhala.variable}`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-primary/40 selection:text-primary-foreground">
        <ThemeProvider>
          <LanguageProvider>
            <PreloaderWrapper>
              <AuthProvider>
                <Navbar />
                <main className="flex-grow flex flex-col">{children}</main>
                <Footer />
                <CartDrawer />
              </AuthProvider>
            </PreloaderWrapper>
            <WhatsAppButton />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
