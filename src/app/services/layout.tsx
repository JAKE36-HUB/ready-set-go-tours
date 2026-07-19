import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Travel Services | Ready Set Go Tours & Travel",
  description:
    "Explore our full range of travel services including hotel bookings, air ticketing, visa assistance, airport transfers, group travel, and guided tours across Kenya and Tanzania.",
  keywords: [
    "Kenya travel services",
    "hotel booking Kenya",
    "air ticketing Kenya",
    "visa assistance Kenya",
    "airport transfer Nairobi",
    "group travel Kenya",
    "safari booking services",
    "Tanzania travel services",
  ],
  openGraph: {
    title: "Travel Services | Ready Set Go Tours & Travel",
    description:
      "Explore our full range of travel services including hotel bookings, air ticketing, visa assistance, airport transfers, group travel, and guided tours across Kenya and Tanzania.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ready Set Go Tours & Travel Services",
      },
    ],
  },
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "Services", item: "/services" },
      ]} />
      {children}
    </>
  );
}
