import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif-loaded",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans-loaded",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SipBouquet ☕🍵 — Send Aesthetic Coffee & Matcha Gifts",
  description:
    "Craft and share beautiful digital coffee & matcha bouquets with AI-generated heartfelt messages. The perfect way to brighten someone's day.",
  keywords: ["coffee gift", "matcha gift", "digital bouquet", "AI messages", "gift card"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-espresso font-sans">
        {children}
      </body>
    </html>
  );
}
