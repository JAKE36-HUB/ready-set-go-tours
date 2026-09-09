const WA_GRAPH = "https://graph.facebook.com/v21.0"

function isConfigured(): boolean {
  return Boolean(
    process.env.WHATSAPP_TOKEN &&
    process.env.WHATSAPP_PHONE_ID &&
    process.env.WHATSAPP_RECIPIENT
  )
}

export async function sendWhatsAppText(to: string, body: string): Promise<boolean> {
  if (!isConfigured()) return false
  const phoneId = process.env.WHATSAPP_PHONE_ID!
  const res = await fetch(`${WA_GRAPH}/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_TOKEN!}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body },
    }),
  })
  return res.ok
}

export async function sendWhatsAppChatAlert(visitorName: string, preview: string, page: string): Promise<boolean> {
  if (!isConfigured()) return false
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.readysetgosafaris.com"
  const where = page ? `\n🌐 Page: ${page.slice(0, 80)}` : ""
  const text = [
    `🔔 New website chat${where}`,
    ``,
    `👤 ${visitorName || "Website visitor"}`,
    `💬 ${preview.slice(0, 300)}`,
    ``,
    `Open: ${site}/admin/chat`,
  ].join("\n")
  return sendWhatsAppText(process.env.WHATSAPP_RECIPIENT!, text)
}