import { absoluteUrl, SITE_URL } from "@/lib/seo";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const LOGO_URL = `${SITE_URL}/icon.png`;

interface BreadcrumbItem {
  name: string;
  item: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  if (!items.length) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.item),
    })),
  };
  return (
    <script
      id="breadcrumb-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function TourPackageJsonLd({
  name,
  description,
  image,
  price,
  duration,
  url,
}: {
  name: string;
  description: string;
  image: string;
  price: number;
  duration: string;
  url: string;
}) {
  const pageUrl = absoluteUrl(url);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: [absoluteUrl(image)],
    url: pageUrl,
    brand: {
      "@type": "Brand",
      name: "Ready Set Go Safaris",
    },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: pageUrl,
      seller: { "@id": ORGANIZATION_ID },
    },
    additionalProperty: {
      "@type": "PropertyValue",
      name: "Duration",
      value: duration,
    },
  };
  return (
    <script
      id="tour-package-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  image,
  url,
  datePublished,
  dateModified,
  authorName,
}: {
  title: string;
  description: string;
  image: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}) {
  const pageUrl = absoluteUrl(url);
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: [absoluteUrl(image)],
    url: pageUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    author: {
      "@type": "Person",
      name: authorName || "Ready Set Go Tours & Travel",
    },
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Ready Set Go Safaris",
      logo: {
        "@type": "ImageObject",
        url: LOGO_URL,
      },
    },
  };
  if (datePublished) schema.datePublished = datePublished;
  if (dateModified || datePublished) schema.dateModified = dateModified || datePublished;
  return (
    <script
      id="article-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FaqJsonLd({ faqs }: { faqs: { q: string; a: string }[] }) {
  if (!faqs.length) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
  return (
    <script
      id="faq-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServiceJsonLd({
  name,
  description,
  image,
  url,
}: {
  name: string;
  description: string;
  image: string;
  url: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    image: image ? absoluteUrl(image) : undefined,
    url: absoluteUrl(url),
    provider: { "@id": ORGANIZATION_ID },
    areaServed: [
      { "@type": "Country", name: "Kenya" },
      { "@type": "Country", name: "Tanzania" },
    ],
  };
  return (
    <script
      id="service-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
