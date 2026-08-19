import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Travel Services",
  description:
    "Explore our travel services: hotel bookings, air ticketing, visa assistance, airport transfers, group travel, and guided tours across Kenya and Tanzania.",
  openGraph: {
    title: "Travel Services | Ready Set Go Tours & Travel",
    description:
      "Explore our full range of travel services: hotel bookings, air ticketing, visa assistance, airport transfers, group travel, and guided tours across Kenya and Tanzania.",
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
  twitter: {
    card: "summary_large_image",
    title: "Travel Services | Ready Set Go Tours & Travel",
    description: "Explore our full range of travel services: hotel bookings, air ticketing, visa assistance, airport transfers, group travel, and guided tours across Kenya and Tanzania.",
    images: ["/og-image.jpg"],
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
