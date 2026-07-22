import type { Metadata } from "next"
import { getSupabase } from "@/lib/supabase"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const { data } = await getSupabase()
      .from("deals")
      .select("title, description")
      .eq("slug", slug)
      .single()
    if (data) return { title: data.title, description: data.description?.slice(0, 160) }
  } catch {}
  return {}
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
