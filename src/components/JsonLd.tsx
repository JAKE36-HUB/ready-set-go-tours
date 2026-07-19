import Script from "next/script";

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
      item: `https://readysetgosafaris.com${item.item}`,
    })),
  };
  return (
    <Script
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
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    url: `https://readysetgosafaris.com${url}`,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `https://readysetgosafaris.com${url}`,
    },
    additionalProperty: {
      "@type": "PropertyValue",
      name: "Duration",
      value: duration,
    },
  };
  return (
    <Script
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
  authorName,
}: {
  title: string;
  description: string;
  image: string;
  url: string;
  datePublished?: string;
  authorName?: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    url: `https://readysetgosafaris.com${url}`,
    author: {
      "@type": "Person",
      name: authorName || "Ready Set Go Tours & Travel",
    },
  };
  if (datePublished) schema.datePublished = datePublished;
  return (
    <Script
      id="article-jsonld"
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
    image,
    url: `https://readysetgosafaris.com${url}`,
    provider: {
      "@type": "TravelAgency",
      name: "Ready Set Go Tours & Travel",
      url: "https://readysetgosafaris.com",
    },
  };
  return (
    <Script
      id="service-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
