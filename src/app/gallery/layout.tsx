import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse stunning photos from our safaris, beaches, and cultural experiences across Kenya and Tanzania. See the adventure that awaits you with Ready Set Go Tours.",
  openGraph: {
    title: "Gallery | Ready Set Go Tours & Travel",
    description: "Stunning images from East African safaris and travels.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Safari Gallery - Ready Set Go Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery | Ready Set Go Tours & Travel",
    description: "Stunning images from East African safaris and travels.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/gallery",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "Gallery", item: "/gallery" },
      ]} />
      {children}
    </>
  );
}
