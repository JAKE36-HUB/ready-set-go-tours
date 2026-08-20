import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isAdminEmail } from "@/lib/admin-access"

// Old WordPress site URLs (still indexed by Google) → new site pages
const WP_REDIRECTS: Record<string, string> = {
  "/about-us": "/about",
  "/contact-us": "/contact",
  "/faqs": "/faq",
  "/honeymoon-safaris": "/honeymoon-packages",
  "/kenya-safaris": "/kenya-tours",
  "/kenya-safaris-budget-camping": "/kenya-tours",
  "/kenya-lodge-safaris": "/kenya-tours",
  "/tanzania-safaris": "/tanzania-tours",
  "/combined-kenya-tanzania-safaris": "/holiday-packages",
  "/category/travel-guide": "/travel-guide",
  "/travelers-information": "/travel-guide",
  "/destination": "/holiday-packages",
  "/destinations/kenya": "/kenya-tours",
  "/destinations/mt-kenya-climbing": "/mountain-trekking",
  "/destinations/mt-kilimanjaro-climbing": "/mountain-trekking",
  "/destinations/combined-kenya-tanzania-safaris": "/holiday-packages",
  "/home": "/",
  "/index.html": "/",
  "/trip-listing": "/holiday-packages",
  "/trip-search-result": "/holiday-packages",
  "/trip-types": "/holiday-packages",
  "/enquiry-thank-you-page": "/contact",
  "/thank-you": "/contact",
  "/checkout": "/",
  "/wishlist": "/",
  "/wp-travel-engine-cart": "/",
  "/wp-travel-engine-checkout": "/",
  "/a-guide-to-rocky-mountain-vacations": "/travel-guide",
}

function wpRedirect(path: string): string | null {
  if (path === "/trip" || path.startsWith("/trip/")) {
    const lower = path.toLowerCase()
    if (lower.includes("honeymoon")) return "/honeymoon-packages"
    if (lower.includes("kilimanjaro") || lower.includes("mountain")) return "/mountain-trekking"
    if (lower.includes("beach")) return "/beach-holidays"
    return "/holiday-packages"
  }
  if (path.startsWith("/packages/") || path === "/packages") return "/holiday-packages"
  if (path.startsWith("/trip-tag/")) return "/holiday-packages"
  if (path.startsWith("/author/")) return "/travel-guide"
  if (path.startsWith("/wp-")) return "/"
  if (path === "/blog" || path.startsWith("/blog/")) return "/travel-guide"
  return WP_REDIRECTS[path] ?? null
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const barePath = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path

  // Old WordPress site URLs → current pages (Google still links to them)
  const wpDest = wpRedirect(barePath)
  if (wpDest) {
    const url = request.nextUrl.clone()
    url.pathname = wpDest
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
