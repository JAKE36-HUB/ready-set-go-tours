import type { SupabaseClient } from "@supabase/supabase-js"

export async function cancelPendingFactor(supabase: SupabaseClient): Promise<void> {
  const { data: factors } = await supabase.auth.mfa.listFactors()
  const pending = factors?.totp.find((f) => f.status !== "verified")
  if (!pending?.id) return

  const { data: { user } } = await supabase.auth.getUser()
  const res = await fetch("/api/admin/mfa-factor", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: user?.id, factorId: pending.id }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || "Could not cancel the previous setup")
  }
}