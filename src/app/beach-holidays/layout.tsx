import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Beach Holidays & Coastal Getaways | Ready Set Go Tours & Travel",
  description:
    "Escape to pristine beaches along the Kenyan and Tanzanian coast. Diani Beach, Zanzibar, Watamu, and Lamu luxury beach holiday packages.",
  keywords: [
    "beach holidays Kenya",
    "Diani Beach resort",
    "Zanzibar beach holiday",
    "Watamu marine park",
    "Indian Ocean beaches",
    "luxury beach Africa",
  ],
  openGraph: {
    title: "Beach Holidays | Ready Set Go Tours & Travel",
    description:
      "Discover turquoise waters, white-sand beaches, and world-class resorts along the East African coast.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Beach Holidays & Coastal Getaways - Ready Set Go Tours",
      },
    ],
  },
  alternates: {
    canonical: "/beach-holidays",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "Destinations", item: "/kenya-tours" },
        { name: "Beach Holidays", item: "/beach-holidays" },
      ]} />
      {children}
    </>
  );
}
