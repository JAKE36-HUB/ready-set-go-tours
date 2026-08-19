import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Ready Set Go Tours to plan your dream East African safari. Our Nairobi-based experts craft personalized safari, beach, and trekking itineraries.",
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
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Ready Set Go Tours & Travel",
    description: "Ready to plan your dream safari? Contact our travel experts for a personalized itinerary.",
    images: ["/og-image.jpg"],
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
