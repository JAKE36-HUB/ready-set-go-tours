import { NextResponse } from "next/server"

type Entry = { count: number; resetAt: number }

const RATE_LIMIT_STORE = new Map<string, Entry>()

// Serverless instances are long-lived, so the map would otherwise grow forever.
const MAX_STORE_ENTRIES = 5_000

function prune(now: number): void {
  if (RATE_LIMIT_STORE.size <= MAX_STORE_ENTRIES) return
  for (const [key, entry] of RATE_LIMIT_STORE) {
    if (now > entry.resetAt) RATE_LIMIT_STORE.delete(key)
  }
  // Still oversized (all live): drop the oldest entries so memory stays bounded.
  while (RATE_LIMIT_STORE.size > MAX_STORE_ENTRIES) {
    const oldest = RATE_LIMIT_STORE.keys().next()
    if (oldest.done) break
    RATE_LIMIT_STORE.delete(oldest.value)
  }
}

function read(key: string, now: number): Entry | null {
  const entry = RATE_LIMIT_STORE.get(key)
  if (!entry) return null
  if (now > entry.resetAt) {
    RATE_LIMIT_STORE.delete(key)
    return null
  }
  return entry
}

/**
 * Count this attempt against the key. Returns false when the caller is
 * currently over the limit and the attempt must not be processed.
 */
export function rateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now()
  prune(now)
  const entry = read(key, now)
  if (!entry) {
    RATE_LIMIT_STORE.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= maxRequests) return false
  entry.count++
  return true
}

/**
 * Read-only check: is this key currently blocked? Never consumes budget, so
 * a caller can check before doing work and only charge the attempt if it fails.
 */
export function isBlocked(key: string, maxRequests: number): boolean {
  const entry = read(key, Date.now())
  return !!entry && entry.count >= maxRequests
}

/**
 * Charge a *failed* attempt. Used so that successful sign-ins and honest
 * retries never lock the user out of their own account.
 */
export function recordFailure(key: string, maxRequests: number, windowMs: number): void {
  const now = Date.now()
  prune(now)
  const entry = read(key, now)
  if (!entry) {
    RATE_LIMIT_STORE.set(key, { count: 1, resetAt: now + windowMs })
    return
  }
  if (entry.count >= maxRequests) return
  entry.count++
}

/** Clear a key after a successful action (e.g. a good sign-in). */
export function resetRateLimit(key: string): void {
  RATE_LIMIT_STORE.delete(key)
}

/** Seconds until the key stops being blocked (0 when not blocked). */
export function retryAfterSeconds(key: string): number {
  const entry = read(key, Date.now())
  if (!entry) return 0
  return Math.max(1, Math.ceil((entry.resetAt - Date.now()) / 1000))
}

function allowedHost(hostname: string, hostHeader: string): boolean {
  if (hostname === hostHeader) return true
  if (hostname === "localhost" || hostname.endsWith(".vercel.app")) return true

  const extra = [process.env.SITE_URL, process.env.NEXT_PUBLIC_SITE_URL]
    .filter(Boolean)
    .map((u) => {
      try {
        return new URL(u as string).hostname.toLowerCase()
      } catch {
        return null
      }
    })
    .filter((h): h is string => !!h)

  const allowlisted = new Set([
    ...extra,
    "readysetgosafaris.com",
    "www.readysetgosafaris.com",
  ])

  return allowlisted.has(hostname)
}

/**
 * Same-origin check for state-changing requests.
 *
 * Browsers send `Origin` on POSTs; fall back to `Referer` when it is absent
 * and allow the request through when neither is present (non-browser clients
 * cannot be cross-site). A present-but-wrong origin is rejected.
 */
export function verifyOrigin(request: Request): boolean {
  const hostHeader = (request.headers.get("host") || "").split(":")[0].toLowerCase()
  const candidate = request.headers.get("origin") || request.headers.get("referer")

  if (!candidate) return true

  let hostname: string
  try {
    hostname = new URL(candidate).hostname.toLowerCase()
  } catch {
    return false
  }

  return allowedHost(hostname, hostHeader)
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
