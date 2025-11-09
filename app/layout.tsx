/**
 * Root layout for ZeroLimitApparel
 * Includes session provider, toast notifications, and global styles
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZeroLimitApparel - Premium Hoodies",
  description: "Shop premium quality hoodies with minimalist design. Break your limits with ZeroLimitApparel.",
  keywords: ["hoodies", "streetwear", "fashion", "minimalist", "premium"],
  openGraph: {
    title: "ZeroLimitApparel - Premium Hoodies",
    description: "Shop premium quality hoodies with minimalist design.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white text-black min-h-screen flex flex-col`}>
        <Providers>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
