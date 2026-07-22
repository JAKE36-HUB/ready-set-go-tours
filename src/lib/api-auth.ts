import { createServerClient } from "@supabase/ssr"

export async function requireUser(request: Request) {
  const cookies = request.headers.get("cookie")?.split("; ").filter(Boolean).map((c) => {
    const [name, ...rest] = c.split("=")
    return { name, value: rest.join("=") }
  }) || []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookies
        },
        setAll() {},
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}
