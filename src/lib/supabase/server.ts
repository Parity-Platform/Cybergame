import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const SUPABASE_ANON =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Parameters<typeof cookieStore.set>[2] }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // server components cannot set cookies; middleware refreshes session
        }
      },
    },
  });
}

export async function safeGetUser(supabase: Awaited<ReturnType<typeof createClient>>) {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch {
    return null;
  }
}

export async function createServiceClient() {
  const { createClient: createAdmin } = await import("@supabase/supabase-js");
  return createAdmin(
    SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key",
    { auth: { persistSession: false } }
  );
}
