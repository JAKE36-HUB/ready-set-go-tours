import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Best Safari Deals & Offers | Ready Set Go Tours & Travel",
  description: "Discover exclusive deals on Kenya and Tanzania safaris, Mount Kenya adventures, beach holidays, and group packages. Save up to 25% on your dream East African safari.",
  keywords: ["safari deals", "Kenya tour discounts", "Mount Kenya Nanyuki", "African safari offers", "last minute safari", "group safari discounts", "family safari deals"],
  openGraph: {
    title: "Best Safari Deals & Special Offers | Ready Set Go Tours",
    description: "Exclusive early bird, group, and last-minute deals on East African safaris. Save up to 25% on luxury tented camps, Mount Kenya treks, and beach holidays.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Safari Deals & Special Offers - Ready Set Go Tours",
      },
    ],
  },
  alternates: {
    canonical: "/deals",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "Deals", item: "/deals" },
      ]} />
      {children}
    </>
  );
}
