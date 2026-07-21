import type { Metadata } from "next"
import { HONEYMOON_PACKAGES } from "@/lib/constants"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const pkg = HONEYMOON_PACKAGES.find((p) => p.slug === slug)
  if (!pkg) return {}
  return {
    title: pkg.name,
    description: pkg.description.slice(0, 160),
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
