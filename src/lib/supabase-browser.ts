"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"

let client: SupabaseClient | null = null

/**
 * Single shared browser client.
 *
 * Calling `createBrowserClient` repeatedly returns separate instances that can
 * race each other while writing auth cookies — which shows up as intermittent
 * sign-in failures. Create it once and reuse it.
 */
export function getBrowserClient(): SupabaseClient {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return client
}
