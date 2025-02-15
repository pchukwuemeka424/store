import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: `${process.env.APP_NAME}`,
  description: `${process.env.APP_DESCRIPTION}`,
  keywords: "Afrivendor, Nigeria vendor, afrivendor.ng, online marketplace, Nigeria businesses,wigs hair online vendors , Nigeria e-commerce, vendor platform, buy from Africa, shop Nigeria products, Nigeria goods, local Nigeria businesses, online vendors", // Additional keywords added
  author: "Acehub Technologies", // Author of the site
  viewport: "width=device-width, initial-scale=1.0", // Ensuring responsiveness
  robots: "index, follow", // Directs search engines on how to index the site
  openGraph: {
    title: `${process.env.APP_NAME}`,
    description: `${process.env.APP_DESCRIPTION}`,
    url: process.env.APP_URL || "default-url.com", // URL of the app
    images: [{ url: "https://sxkmrpzbtqpraucnmnjm.supabase.co/storage/v1/object/public/logos//White-and-Blue-Shopping-Cart-Logo-DesignEvo-Logo-Maker-02-14-2025_08_47_PM.png" }], // Optional: Add an image for Open Graph preview
  },
  twitter: {
    card: "Afrivendor", // Defines the Twitter card type
    title: `${process.env.APP_NAME}`,
    description: `${process.env.APP_DESCRIPTION}`,
    images: ["https://sxkmrpzbtqpraucnmnjm.supabase.co/storage/v1/object/public/logos//White-and-Blue-Shopping-Cart-Logo-DesignEvo-Logo-Maker-02-14-2025_08_47_PM.png"], // Optional: Add an image for Twitter preview
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* You can also dynamically add additional <meta> tags here */}
      </head>
      <body>{children}</body>
    </html>
  );
}
