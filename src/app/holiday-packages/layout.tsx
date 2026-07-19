import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Holiday Packages & Safari Deals | Ready Set Go Tours & Travel",
  description:
    "Browse our curated collection of safari, beach, mountain, and cultural holiday packages across Kenya and Tanzania. Luxury and budget options available.",
  keywords: [
    "safari packages",
    "holiday packages Kenya",
    "Tanzania safari deals",
    "luxury safari packages",
    "budget safari Africa",
  ],
  openGraph: {
    title: "Holiday Packages | Ready Set Go Tours & Travel",
    description: "Curated safari and holiday packages for every budget and style.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Holiday Packages - Ready Set Go Tours",
      },
    ],
  },
  alternates: {
    canonical: "/holiday-packages",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "Holiday Packages", item: "/holiday-packages" },
      ]} />
      {children}
    </>
  );
}
