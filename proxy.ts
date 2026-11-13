import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Rutele publice (fără sesiune). Se aliniază cu ecranele din #53.
export const PUBLIC_ROUTES = ["/login", "/inregistrare"];

/**
 * Proxy (fostul middleware, redenumit în Next.js 16). Reîmprospătează sesiunea
 * Supabase la fiecare request, ca utilizatorul să rămână logat după redeschiderea
 * aplicației.
 *
 * Protecția rutelor (redirect la /login) este pregătită mai jos, dar DEZACTIVATĂ
 * până când există pagina de login din #53 — altfel toate rutele ar da 404.
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Fără Supabase configurat, aplicația pornește normal (dev fără `.env.local`).
  if (!url || !anonKey) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // IMPORTANT: nu pune cod între crearea clientului și getUser() (reîmprospătarea sesiunii).
  await supabase.auth.getUser();

  // --- Protecția rutelor (se activează odată cu #53) ---
  // const path = request.nextUrl.pathname;
  // const isPublic = PUBLIC_ROUTES.some((r) => path === r || path.startsWith(`${r}/`));
  // if (!user && !isPublic) {
  //   const redirectUrl = request.nextUrl.clone();
  //   redirectUrl.pathname = "/login";
  //   return NextResponse.redirect(redirectUrl);
  // }

  return response;
}

export const config = {
  // Proxy rulează pe toate rutele, mai puțin fișierele statice și imaginile.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
