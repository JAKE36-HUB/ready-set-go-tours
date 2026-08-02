import { sanitizeString } from "@/lib/security"

const MAX_FIELD = 500

export interface LeadInput {
  name?: unknown
  phone?: unknown
  email?: unknown
  country?: unknown
  destination?: unknown
  travel_date?: unknown
  budget?: unknown
  adults?: unknown
  children?: unknown
  message?: unknown
  source?: unknown
  page?: unknown
  utm_source?: unknown
  utm_medium?: unknown
  utm_campaign?: unknown
  browser?: unknown
  device?: unknown
  ip?: unknown
  ip_country?: unknown
  popup_lead_id?: unknown
}

const NOTIFY_TYPE: Record<string, string> = {
  contact_form: "contact_form",
  booking: "new_booking",
  newsletter: "newsletter",
  whatsapp: "whatsapp_request",
  popup_lead: "popup_lead",
  package_inquiry: "package_inquiry",
}

export function notifyTypeForSource(source: string): string {
  return NOTIFY_TYPE[source] || "new_lead"
}

function summarize(input: Record<string, unknown>): { title: string; body: string } {
  const s = (v: unknown) => sanitizeString(v, MAX_FIELD)
  const name = s(input.name) || s(input.email) || "Visitor"
  const country = s(input.country)
  const destination = s(input.destination)
  const budget = s(input.budget)
  const parts: string[] = []
  if (country) parts.push(country)
  if (destination) parts.push(destination)
  if (budget) parts.push(`Budget ${budget}`)
  return { title: name, body: parts.join(" · ") }
}

export async function createLead(sb: import("@supabase/supabase-js").SupabaseClient, input: LeadInput): Promise<number> {
  const s = (v: unknown) => sanitizeString(v, MAX_FIELD)
  const source = s(input.source) || "contact_form"

  const { data, error } = await sb
    .from("leads")
    .insert({
      name: s(input.name),
      phone: s(input.phone),
      email: s(input.email),
      country: s(input.country),
      destination: s(input.destination),
      travel_date: s(input.travel_date),
      budget: s(input.budget),
      adults: s(input.adults),
      children: s(input.children),
      message: s(input.message),
      source,
      page: s(input.page),
      utm_source: s(input.utm_source),
      utm_medium: s(input.utm_medium),
      utm_campaign: s(input.utm_campaign),
      browser: s(input.browser),
      device: s(input.device),
      ip: s(input.ip),
      ip_country: s(input.ip_country),
      popup_lead_id: typeof input.popup_lead_id === "number" ? input.popup_lead_id : null,
    })
    .select("id")
    .single()

  if (error) throw new Error(error.message)

  const leadId = data.id as number

  await sb.from("lead_events").insert({
    lead_id: leadId,
    event_type: "created",
    detail: `Lead created via ${source.replace("_", " ")}`,
  })

  const { title, body } = summarize(input as Record<string, unknown>)
  await sb.from("notifications").insert({
    type: notifyTypeForSource(source),
    title,
    body,
    lead_id: leadId,
  })

  return leadId
}
