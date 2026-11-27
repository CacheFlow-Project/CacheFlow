// Ecranele care se pot deschide fără cont (#53). Folosite de proxy.ts (protecția rutelor)
// și de bara de navigare (care nu apare pe aceste ecrane).
export const PUBLIC_ROUTES = ["/start", "/login", "/inregistrare"];

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}
