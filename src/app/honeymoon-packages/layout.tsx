import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Honeymoon Packages | Romantic Safaris & Beach Escapes",
  description: "Discover handcrafted honeymoon packages across Kenya and Tanzania. Private game drives, candlelit bush dinners, luxury beach villas, and romantic escapes.",
  openGraph: {
    title: "Honeymoon Packages | Ready Set Go Tours & Travel",
    description: "Handcrafted romantic escapes across East Africa. Private safaris, beachfront villas, and unforgettable moments for your dream honeymoon.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Honeymoon Packages - Ready Set Go Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Honeymoon Packages | Ready Set Go Tours & Travel",
    description: "Handcrafted romantic escapes across East Africa. Private safaris, beachfront villas, and unforgettable moments for your dream honeymoon.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/honeymoon-packages",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "Tours", item: "/holiday-packages" },
        { name: "Honeymoon Packages", item: "/honeymoon-packages" },
      ]} />
      {children}
    </>
  );
}
