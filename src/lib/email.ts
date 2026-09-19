import { sanitizeString } from "@/lib/security"

const s = (value: unknown, max = 500): string => sanitizeString(value, max)

const NOTIFY_EMAIL = process.env.CHAT_NOTIFY_EMAIL || "readysetgotoursandtravel43@gmail.com"
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_CHAT_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ""
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY || ""

/** Sends an email through the EmailJS REST API. Requires the service/template ids and the account private key. */
export async function sendEmailViaEmailJs(params: Record<string, string>): Promise<boolean> {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PRIVATE_KEY) return false
  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${EMAILJS_PRIVATE_KEY}`,
      },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        template_params: params,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

export interface ChatEmailInput {
  name: string
  email: string
  message: string
  page: string
}

/** Notifies the company inbox when a visitor sends a new chat message. Best-effort, never throws. */
export async function notifyChatEmail(input: ChatEmailInput): Promise<boolean> {
  try {
    const name = s(input.name).trim() || "Website visitor"
    const email = s(input.email).trim().toLowerCase() || "not provided"
    const message = s(input.message, 1000).slice(0, 600)
    const page = s(input.page, 300) || "/"
    return await sendEmailViaEmailJs({
      to_email: NOTIFY_EMAIL,
      from_name: name,
      name,
      email,
      visitor_email: email,
      message,
      page,
      subject: `New chat message from ${name} | Ready Set Go Tours`,
    })
  } catch {
    return false
  }
}