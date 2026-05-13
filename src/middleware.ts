import { NextResponse, type NextRequest } from "next/server";
import { updateSession, getActiveSubscription } from "@/lib/supabase/middleware";

const AUTH_REQUIRED = ["/account", "/gallery"];
const SUB_REQUIRED = ["/gallery"];

export async function middleware(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request);
  const path = request.nextUrl.pathname;

  if (path.startsWith("/api") || path.startsWith("/_next")) return response;

  const needsAuth = AUTH_REQUIRED.some((p) => path.startsWith(p));
  if (needsAuth && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  const needsSub = SUB_REQUIRED.some((p) => path.startsWith(p));
  if (needsSub && user) {
    const sub = await getActiveSubscription(supabase, user.id);
    if (!sub) {
      const url = request.nextUrl.clone();
      url.pathname = "/account";
      url.searchParams.set("upgrade", "1");
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|covers|.*\\.svg).*)"],
};
