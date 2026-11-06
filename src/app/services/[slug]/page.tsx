import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SERVICES, COMPANY } from "@/lib/constants"
import { truncateAtWord } from "@/lib/seo"
import ServiceContent from "./ServiceContent"
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = SERVICES.find((s) => s.slug === slug)
  if (!service) return {}
  const description = truncateAtWord(service.description, 158)
  const title = `${service.title} | ${COMPANY.shortName}`
  return {
    title: { absolute: title },
    description,
    openGraph: {
      url: `https://www.readysetgosafaris.com/services/${slug}`,
      title,
      description,
      type: "website",
      images: service.image
        ? [{ url: service.image, width: 800, height: 600, alt: service.title }]
        : undefined,
    },
    alternates: {
      canonical: `/services/${slug}`,
    },
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = SERVICES.find((s) => s.slug === slug)
  if (!service) notFound()

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", item: "/" },
        { name: "Services", item: "/services" },
        { name: service.title, item: `/services/${slug}` },
      ]} />
      <ServiceJsonLd
        name={service.title}
        description={service.description}
        image={service.image}
        url={`/services/${slug}`}
      />
      <ServiceContent service={service} />
    </>
  )
}
