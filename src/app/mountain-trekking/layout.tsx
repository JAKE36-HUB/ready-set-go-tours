import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Mountain Trekking & Climbing | Mount Kenya & Kilimanjaro | Ready Set Go Tours",
  description:
    "Conquer Africa's legendary peaks with expert guides. Mount Kenya trekking packages, Kilimanjaro climbs, and high-altitude adventures. Guided summit expeditions with full support.",
  keywords: [
    "Mount Kenya trek",
    "Mount Kenya climbing",
    "Kilimanjaro climb",
    "Africa mountain trekking",
    "Kenya hiking tours",
    "Nanyuki mountain trek",
    "guided summit expedition",
    "high altitude trek Kenya",
  ],
  openGraph: {
    title: "Mountain Trekking | Ready Set Go Tours & Travel",
    description:
      "Conquer Africa's highest peaks with expert guides. From Mount Kenya to Kilimanjaro, our treks deliver adventure, endurance, and breathtaking summit views.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mountain Trekking - Ready Set Go Tours",
      },
    ],
  },
  alternates: {
    canonical: "/mountain-trekking",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "Tours", item: "/holiday-packages" },
        { name: "Mountain Trekking", item: "/mountain-trekking" },
      ]} />
      {children}
    </>
  );
}
