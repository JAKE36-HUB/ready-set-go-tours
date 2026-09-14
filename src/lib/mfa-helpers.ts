import type { SupabaseClient } from "@supabase/supabase-js"

export async function resetAllFactors(supabase: SupabaseClient): Promise<void> {
  const { data: factors } = await supabase.auth.mfa.listFactors()
  const ids = (factors?.totp ?? []).map((f) => f.id)
  if (ids.length === 0) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.id) return

  for (const factorId of ids) {
    const res = await fetch("/api/admin/mfa-factor", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, factorId }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || "Could not reset authenticators")
    }
  }
}