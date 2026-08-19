import type { Metadata } from "next";
import { FAQ_ITEMS } from "@/lib/constants";
import { BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "FAQ | Safari Travel Guide",
  description:
    "Frequently asked questions about East African safaris. Visas, vaccinations, packing, best time to visit, accommodation, and more from Kenya's trusted tour operator.",
  openGraph: {
    title: "FAQ | Ready Set Go Tours & Travel",
    description:
      "Everything you need to know about planning your East African safari — from visas and vaccinations to packing and accommodation.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Safari FAQ - Ready Set Go Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | Ready Set Go Tours & Travel",
    description: "Everything you need to know about planning your East African safari — from visas and vaccinations to packing and accommodation.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/faq",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "FAQ", item: "/faq" },
      ]} />
      <script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
