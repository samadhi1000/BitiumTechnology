import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PreloaderWrapper from "@/components/PreloaderWrapper";
import CartDrawer from "@/components/CartDrawer";

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
      className="h-full antialiased dark"
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-white selection:bg-[#116466]/40 selection:text-[#D1E8E2] tactile-grain">
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
