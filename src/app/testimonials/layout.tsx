import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Testimonials & Reviews",
  description:
    "Read authentic reviews from our satisfied travelers. Over 2,000 five-star reviews from guests who experienced our luxury safaris and tours across East Africa.",
  openGraph: {
    title: "Testimonials | Ready Set Go Tours & Travel",
    description: "Authentic reviews from our satisfied safari travelers.",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Testimonials - Ready Set Go Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Testimonials | Ready Set Go Tours & Travel",
    description: "Authentic reviews from our satisfied safari travelers.",
    images: ["/opengraph-image.png"],
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
