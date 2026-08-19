import { NextRequest } from "next/server"
import { requireUser } from "@/lib/api-auth"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export const dynamic = "force-dynamic"
export const maxDuration = 300

export async function GET(req: NextRequest) {
  const user = await requireUser(req)
  if (!user) {
    return new Response("unauthorized", { status: 401 })
  }

  const encoder = new TextEncoder()
  const sb = getSupabaseAdmin()

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (event: { table: string; payload: Record<string, unknown> }) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
        } catch {
          /* client gone */
        }
      }

      const channel = sb
        .channel("admin-lead-stream")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "leads" },
          (payload) => send({ table: "leads", payload: payload.new })
        )
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notifications" },
          (payload) => send({ table: "notifications", payload: payload.new })
        )
        .subscribe()

      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`))
        } catch {
          clearInterval(heartbeat)
        }
      }, 15000)

      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeat)
        sb.removeChannel(channel)
        try {
          controller.close()
        } catch {
          /* already closed */
        }
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
