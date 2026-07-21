import type { Metadata } from "next"
import { DEALS } from "@/lib/constants"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const deal = DEALS.find((d) => d.slug === slug)
  if (!deal) return {}
  return {
    title: deal.title,
    description: deal.description.slice(0, 160),
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
