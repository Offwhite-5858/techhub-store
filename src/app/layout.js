import { Inter } from "next/font/google";
import ClientLayout from "@/components/layout/ClientLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  metadataBase: new URL("https://techhub-store-five.vercel.app"),
  title: {
    default: "TechHub Store | Best Tech Prices in Nigeria",
    template: "%s | TechHub Store",
  },
  description:
    "Shop smartphones, laptops & accessories at unbeatable prices. Free shipping nationwide with warranty and 7-day returns.",
  keywords: [
    "buy phones Nigeria",
    "laptops Lagos",
    "iPhone price Nigeria",
    "Samsung Galaxy",
    "tech store Nigeria",
    "free shipping Nigeria",
    "buy MacBook Nigeria",
    "AirPods Nigeria",
    "smart watch Nigeria",
    "best phone deals",
    "cheap laptops",
    "TechHub Store",
  ],
  authors: [{ name: "TechHub Store", url: "https://techhub-store-five.vercel.app" }],
  creator: "TechHub Store",
  publisher: "TechHub Store",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://techhub-store-five.vercel.app",
    siteName: "TechHub Store",
    title: "TechHub Store | Best Tech Prices in Nigeria",
    description:
      "Shop smartphones, laptops & accessories at unbeatable prices. Free shipping nationwide with warranty.",
    images: [
      {
        url: "https://techhub-store-five.vercel.app/og-image.svg",
        width: 1200,
        height: 630,
        alt: "TechHub Store - Latest Tech at Best Prices",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechHub Store | Best Tech Prices",
    description:
      "Premium tech at unbeatable prices with free shipping nationwide.",
    images: ["https://techhub-store-five.vercel.app/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "RTZx01oQaOb325RCK64dYtpfJuLt0Bjt2xS5ALeng1Y",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}