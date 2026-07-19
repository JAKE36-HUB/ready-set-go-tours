import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Honeymoon Packages | Romantic Safaris & Beach Escapes | Ready Set Go Tours",
  description: "Discover our handcrafted honeymoon packages across Kenya and Tanzania. Private game drives, candlelit bush dinners, luxury beach villas, and unforgettable romantic experiences.",
  keywords: ["honeymoon packages Kenya", "romantic safari", "honeymoon Tanzania", "luxury honeymoon Africa", "beach honeymoon Zanzibar", "romantic getaway East Africa"],
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
