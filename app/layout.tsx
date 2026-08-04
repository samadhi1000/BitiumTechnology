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
