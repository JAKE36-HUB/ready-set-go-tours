import { NextResponse } from "next/server"

const RATE_LIMIT_STORE = new Map<string, { count: number; resetAt: number }>()

export function rateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = RATE_LIMIT_STORE.get(key)
  if (!entry || now > entry.resetAt) {
    RATE_LIMIT_STORE.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= maxRequests) return false
  entry.count++
  return true
}

export function verifyOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")
  const referer = request.headers.get("referer")
  const allowed = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(".supabase.co", ".vercel.app") || ""
  const host = request.headers.get("host") || ""

  const candidates = [origin, referer].filter(Boolean)
  if (candidates.length === 0) return true

  return candidates.some((url) => {
    try {
      const parsed = new URL(url)
      return (
        parsed.hostname === host ||
        parsed.hostname.endsWith(".vercel.app") ||
        parsed.hostname === "readysetgosafaris.com" ||
        parsed.hostname === "www.readysetgosafaris.com" ||
        parsed.hostname === "localhost"
      )
    } catch {
      return false
    }
  })
}

export function sanitizeString(value: unknown, maxLength = 5000): string {
  if (typeof value !== "string") return ""
  return value.slice(0, maxLength).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T, allowedKeys: string[], maxLens?: Record<string, number>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key of allowedKeys) {
    if (key in obj) {
      const val = obj[key]
      const maxLen = maxLens?.[key] || 5000
      if (typeof val === "string") {
        result[key] = sanitizeString(val, maxLen)
      } else if (typeof val === "number" || typeof val === "boolean" || val === null) {
        result[key] = val
      } else if (Array.isArray(val)) {
        result[key] = val.slice(0, 100).map((item) =>
          typeof item === "string" ? sanitizeString(item, 1000) : item
        )
      } else {
        result[key] = val
      }
    }
  }
  return result
}

export function methodNotAllowed(): NextResponse {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export function badRequest(message = "Invalid request"): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 })
}

export function tooManyRequests(): NextResponse {
  return NextResponse.json({ error: "Too many requests" }, { status: 429 })
}

export function serverError(): NextResponse {
  return NextResponse.json({ error: "Internal server error" }, { status: 500 })
}
