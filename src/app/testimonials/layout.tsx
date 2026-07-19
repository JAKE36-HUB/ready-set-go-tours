import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Testimonials & Reviews | Ready Set Go Tours & Travel",
  description:
    "Read authentic reviews from our satisfied travelers. Over 2,000 five-star reviews from guests who experienced our luxury safaris and tours.",
  keywords: [
    "safari reviews",
    "Kenya tour reviews",
    "Ready Set Go testimonials",
    "safari ratings",
  ],
  openGraph: {
    title: "Testimonials | Ready Set Go Tours & Travel",
    description: "Authentic reviews from our satisfied safari travelers.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Testimonials - Ready Set Go Tours",
      },
    ],
  },
  alternates: {
    canonical: "/testimonials",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "Testimonials", item: "/testimonials" },
      ]} />
      {children}
    </>
  );
}
