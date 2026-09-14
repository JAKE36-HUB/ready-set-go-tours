import type { SupabaseClient } from "@supabase/supabase-js"

export async function resetAllFactors(supabase: SupabaseClient): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.id) return
  const res = await fetch("/api/admin/mfa-factor", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user.id, all: true }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || "Could not reset authenticators")
  }
}