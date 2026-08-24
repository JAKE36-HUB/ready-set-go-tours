const SESSION_KEY = "rsgt_session_id"

export function getClientSessionId(): string {
  if (typeof window === "undefined") return ""
  try {
    return localStorage.getItem(SESSION_KEY) || ""
  } catch {
    return ""
  }
}
