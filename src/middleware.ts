import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Protect admin pages
  if (path.startsWith("/admin") && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/sign-in"
    return NextResponse.redirect(url)
  }

  // Protect admin API routes
  if (path.startsWith("/api/admin") && !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // CSRF protection for mutation API routes
  if (path.startsWith("/api/admin") && ["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    const origin = request.headers.get("origin")
    const host = request.headers.get("host")

    if (origin) {
      try {
        const originHost = new URL(origin).hostname
        if (originHost !== host && !originHost.endsWith(".vercel.app") && originHost !== "localhost") {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }
      } catch {
        return NextResponse.json({ error: "Invalid origin" }, { status: 403 })
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
