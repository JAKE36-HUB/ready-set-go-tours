import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Travel Services",
  description:
    "Explore our travel services: safaris & guided tours, hotel bookings, air ticketing, visa assistance, airport transfers, group travel, and guided tours across Kenya and Tanzania.",
  openGraph: {
    title: "Travel Services | Ready Set Go Tours & Travel",
    description:
      "Explore our full range of travel services: safaris & guided tours, hotel bookings, air ticketing, visa assistance, airport transfers, group travel, and guided tours across Kenya and Tanzania.",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Ready Set Go Tours & Travel Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Services | Ready Set Go Tours & Travel",
    description: "Explore our full range of travel services: safaris & guided tours, hotel bookings, air ticketing, visa assistance, airport transfers, group travel, and guided tours across Kenya and Tanzania.",
    images: ["/opengraph-image.png"],
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
