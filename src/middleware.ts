import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isAdminEmail } from "@/lib/admin-access"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Old blog URLs now live under /travel-guide
  if (path === "/blog" || path.startsWith("/blog/")) {
    const url = request.nextUrl.clone()
    url.pathname = "/travel-guide" + path.slice("/blog".length)
    return NextResponse.redirect(url, 308)
  }

  // Canonical lowercase paths (Google sometimes indexes capitalized URLs)
  if (path !== path.toLowerCase()) {
    const url = request.nextUrl.clone()
    url.pathname = path.toLowerCase()
    return NextResponse.redirect(url, 308)
  }

  // Public routes need no auth work
  if (!path.startsWith("/admin") && !path.startsWith("/api/admin")) {
    return NextResponse.next()
  }

  const { supabase, supabaseResponse } = createClient(request)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect admin pages
  if (path.startsWith("/admin") && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/sign-in"
    return NextResponse.redirect(url)
  }

  // Admin email allowlist — deny anyone not in ADMIN_EMAILS
  if (path.startsWith("/admin") && user && path !== "/admin/denied" && !isAdminEmail(user.email)) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/denied"
    return NextResponse.redirect(url)
  }

  // MFA enforcement — if the user has 2FA enrolled, require an aal2 session
  if (user) {
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
      if (path.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Two-factor authentication required" }, { status: 401 })
      }
      const url = request.nextUrl.clone()
      url.pathname = "/sign-in"
      return NextResponse.redirect(url)
    }
  }

  // Protect admin API routes
  if (path.startsWith("/api/admin") && !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (path.startsWith("/api/admin") && user && !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
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
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\..*).*)"],
}
