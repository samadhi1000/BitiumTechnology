import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { ThemeProvider } from "@/lib/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PreloaderWrapper from "@/components/PreloaderWrapper";

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
      <body className="min-h-full flex flex-col bg-zinc-950 text-white selection:bg-violet-600/30 selection:text-violet-200">
        <ThemeProvider>
          <PreloaderWrapper>
            <AuthProvider>
              <Navbar />
              <main className="flex-grow flex flex-col">{children}</main>
              <Footer />
            </AuthProvider>
          </PreloaderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
