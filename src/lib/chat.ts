import type { SupabaseClient } from "@supabase/supabase-js"
import { sanitizeString } from "@/lib/security"
import { sendWhatsAppChatAlert } from "@/lib/whatsapp"

export type ChatRole = "user" | "assistant" | "owner"

export const MAX_CHAT_CONTENT = 2000

export function cleanChatContent(value: unknown): string {
  return sanitizeString(value, MAX_CHAT_CONTENT)
}

export interface ChatSessionRow {
  session_id: string
  visitor_name: string
  visitor_email: string
  page: string
  label: string
  ai_active: boolean
  last_message_at: string
  created_at: string
  updated_at: string
}

interface ChatSessionInput {
  session_id: string
  visitor_name?: string
  visitor_email?: string
  page?: string
}

export async function upsertChatSession(sb: SupabaseClient, input: ChatSessionInput) {
  const sessionId = sanitizeString(input.session_id, 100)
  if (!sessionId) return null
  const row = {
    session_id: sessionId,
    visitor_name: sanitizeString(input.visitor_name, 120),
    visitor_email: sanitizeString(input.visitor_email, 200),
    page: sanitizeString(input.page, 300),
    updated_at: new Date().toISOString(),
  }
  const { data, error } = await sb.from("chat_sessions").upsert(row, { onConflict: "session_id" }).select().single()
  if (error) throw error
  return data as ChatSessionRow
}

export async function getChatSession(sb: SupabaseClient, sessionId: string): Promise<ChatSessionRow | null> {
  if (!sessionId) return null
  const { data, error } = await sb.from("chat_sessions").select("*").eq("session_id", sessionId).maybeSingle()
  if (error) throw error
  return (data as ChatSessionRow) || null
}

export async function renameChatSession(sb: SupabaseClient, sessionId: string, label: string) {
  if (!sessionId) return null
  const clean = sanitizeString(label, 120)
  const { data, error } = await sb
    .from("chat_sessions")
    .update({ label: clean, updated_at: new Date().toISOString() })
    .eq("session_id", sessionId)
    .select()
    .single()
  if (error) throw error
  return data as ChatSessionRow
}

export async function deleteChatSession(sb: SupabaseClient, sessionId: string) {
  if (!sessionId) return
  // chat_messages reference chat_sessions ON DELETE CASCADE, so they go with it
  const { error } = await sb.from("chat_sessions").delete().eq("session_id", sessionId)
  if (error) throw error
}

export async function touchChatSession(sb: SupabaseClient, sessionId: string) {
  if (!sessionId) return
  await sb.from("chat_sessions").update({ last_message_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("session_id", sessionId)
}

export async function setAiActive(sb: SupabaseClient, sessionId: string, active: boolean) {
  if (!sessionId) return
  await sb.from("chat_sessions").update({ ai_active: active, updated_at: new Date().toISOString() }).eq("session_id", sessionId)
}

export async function insertChatMessage(sb: SupabaseClient, sessionId: string, role: ChatRole, content: string) {
  const clean = cleanChatContent(content)
  if (!sessionId || !clean) return null
  const { data, error } = await sb
    .from("chat_messages")
    .insert({ session_id: sessionId, role, content: clean })
    .select()
    .single()
  if (error) throw error
  return data as { id: number; session_id: string; role: ChatRole; content: string; read_at: string | null; created_at: string }
}

export async function markSessionRead(sb: SupabaseClient, sessionId: string) {
  if (!sessionId) return
  await sb
    .from("chat_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("session_id", sessionId)
    .eq("role", "user")
    .is("read_at", null)
}

export async function getSessionTranscript(sb: SupabaseClient, sessionId: string, afterId = 0) {
  if (!sessionId) return []
  const { data, error } = await sb
    .from("chat_messages")
    .select("id, session_id, role, content, created_at")
    .eq("session_id", sessionId)
    .gt("id", afterId)
    .order("id", { ascending: true })
    .limit(500)
  if (error) throw error
  return data as { id: number; session_id: string; role: ChatRole; content: string; created_at: string }[]
}

export async function getUnreadCount(sb: SupabaseClient) {
  const { count, error } = await sb
    .from("chat_messages")
    .select("id", { count: "exact", head: true })
    .eq("role", "user")
    .is("read_at", null)
  if (error) throw error
  return count || 0
}

export async function listChatSessions(sb: SupabaseClient, limit = 50) {
  const { data, error } = await sb
    .from("chat_sessions")
    .select("*")
    .order("last_message_at", { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data as ChatSessionRow[]) || []
}

export async function notifyOwner(sb: SupabaseClient, sessionId: string, visitorName: string, preview: string) {
  const session = await getChatSession(sb, sessionId)
  const title = (visitorName || (session && session.visitor_name) || "Website visitor").trim() || "Website visitor"
  const body = cleanChatContent(preview)
  await sb.from("notifications").insert({
    type: "chat_message",
    title: `Chat: ${title}`,
    body: body.slice(0, 180),
  })
  try {
    // WhatsApp alert — throttled so a rapid AI conversation doesn't ping repeatedly.
    // Only fires when a visitor resumes (or starts) a chat after 2+ minutes of silence.
    const since = new Date(Date.now() - 120_000).toISOString()
    const { count, error } = await sb
      .from("chat_messages")
      .select("id", { count: "exact", head: true })
      .eq("session_id", sessionId)
      .gt("created_at", since)
    if (error) throw error
    if (count && count > 1) return
    await sendWhatsAppChatAlert(title, body, session?.page || "")
  } catch {
    // WhatsApp must never break the chat flow
  }
}

const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i

export function detectEmail(value: unknown): string {
  const text = sanitizeString(value, 2000)
  const match = text.match(EMAIL_RE)
  return match ? match[0].toLowerCase() : ""
}

export interface EnsureChatLeadInput {
  session_id: string
  name: string
  email: string
  page: string
  message: string
}

/**
 * Creates a CRM lead from a chat session — once per conversation.
 * Requires a name or email (or one detectable from the visitor's message).
 * Never throws: a schema mismatch or insert failure must not break the chat.
 */
export async function ensureChatLead(sb: SupabaseClient, input: EnsureChatLeadInput, detectFromMessage = true) {
  try {
    const email = sanitizeString(input.email, 200).toLowerCase() || (detectFromMessage ? detectEmail(input.message) : "")
    const name = sanitizeString(input.name, 120) || (email ? email.split("@")[0] : "")
    if (!email && !name) return

    const { createLead } = await import("@/lib/leads/create")

    let existing: { id: number }[] | null = null
    try {
      const query = sb.from("leads").select("id").eq("source", "chat")
      if (email) query.eq("email", email)
      if (input.session_id) query.eq("session_id", input.session_id)
      const { data } = await query.limit(1)
      existing = data as { id: number }[]
    } catch {
      // session_id column may not exist yet — fall back to email-only dedupe
      if (email) {
        const { data } = await sb.from("leads").select("id").eq("source", "chat").eq("email", email).limit(1)
        existing = data as { id: number }[]
      }
    }

    if (existing && existing.length > 0) return

    try {
      await createLead(sb, {
        name,
        email,
        source: "chat",
        page: sanitizeString(input.page, 300),
        message: cleanChatContent(input.message).slice(0, 2000),
        session_id: input.session_id,
      })
    } catch {
      // Retry without session_id for schemas that predate the chat migration
      await createLead(sb, {
        name,
        email,
        source: "chat",
        page: sanitizeString(input.page, 300),
        message: cleanChatContent(input.message).slice(0, 2000),
      })
    }
  } catch {
    // lead creation is best-effort — never block the chat
  }
}