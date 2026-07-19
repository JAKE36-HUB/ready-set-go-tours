import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Contact Us | Ready Set Go Tours & Travel",
  description:
    "Get in touch with Ready Set Go Tours to plan your dream East African safari. Contact our Nairobi-based travel experts for personalized safari, beach, and trekking itineraries.",
  keywords: [
    "contact Kenya safari",
    "safari booking Nairobi",
    "Ready Set Go Tours contact",
    "plan safari East Africa",
    "tour operator Kenya email",
    "safari inquiry",
  ],
  openGraph: {
    title: "Contact Us | Ready Set Go Tours & Travel",
    description:
      "Ready to plan your dream safari? Contact our travel experts for a personalized itinerary.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Ready Set Go Tours",
      },
    ],
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "Contact", item: "/contact" },
      ]} />
      {children}
    </>
  );
}
