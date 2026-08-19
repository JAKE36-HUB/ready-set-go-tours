import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Safari & Holiday Packages | Kenya & Tanzania Tours",
  description:
    "Browse group, safari, mountain, and luxury holiday packages across Kenya and Tanzania — Masai Mara, Amboseli, Serengeti, Kilimanjaro. Get a free quote today.",
  openGraph: {
    title: "Safari & Holiday Packages | Ready Set Go Tours & Travel",
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
  twitter: {
    card: "summary_large_image",
    title: "Safari & Holiday Packages | Ready Set Go Tours & Travel",
    description: "Curated safari and holiday packages for every budget and style.",
    images: ["/og-image.jpg"],
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
