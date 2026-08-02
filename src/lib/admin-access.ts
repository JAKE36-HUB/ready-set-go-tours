/**
 * Admin allowlist — only these emails may sign in to /admin.
 * Configure via the ADMIN_EMAILS env var (comma-separated).
 * If ADMIN_EMAILS is not set, access is allowed (open) so the owner
 * is never locked out before configuring it.
 */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const list = adminEmails()
  if (list.length === 0) return true
  return list.includes(email.trim().toLowerCase())
}
