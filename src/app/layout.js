import { Inter } from "next/font/google";
import ClientLayout from "@/components/layout/ClientLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  metadataBase: new URL("https://techhub-store.vercel.app"),
  title: {
    default: "TechHub Store | Latest Tech at Best Prices with Free Shipping",
    template: "%s | TechHub Store",
  },
  description:
    "Buy smartphones, laptops, accessories & smart devices at the best prices in Nigeria. Free shipping nationwide, warranty included, and 7-day returns.",
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
  authors: [{ name: "TechHub Store", url: "https://techhub-store.vercel.app" }],
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
    url: "https://techhub-store.vercel.app",
    siteName: "TechHub Store",
    title: "TechHub Store | Latest Tech at Best Prices with Free Shipping",
    description:
      "Premium smartphones, laptops, and accessories at unbeatable prices. Free shipping nationwide, warranty included.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TechHub Store - Latest Tech at Best Prices",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TechHub Store | Latest Tech at Best Prices",
    description:
      "Premium tech at unbeatable prices with free shipping nationwide.",
    images: ["/og-image.png"],
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
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
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