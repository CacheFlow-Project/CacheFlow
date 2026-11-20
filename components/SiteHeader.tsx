"use client";

import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import LogoutButton from "@/components/LogoutButton";
import { BookIcon, ClipboardCheckIcon, HomeIcon, WalletIcon } from "@/components/icons";
import { isPublicRoute } from "@/lib/public-routes";

type NavItem = {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  href?: string;
  matches: string[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Acasă", Icon: HomeIcon, href: "/", matches: ["/"] },
  {
    label: "Studiu",
    Icon: BookIcon,
    href: "/nivel",
    matches: ["/nivel", "/lectie", "/chestionar", "/instrumente"],
  },
  { label: "Examen", Icon: ClipboardCheckIcon, matches: [] },
  { label: "Bugetul meu", Icon: WalletIcon, matches: [] },
];

function isActive(pathname: string, item: NavItem): boolean {
  return item.matches.some((route) =>
    route === "/" ? pathname === "/" : pathname === route || pathname.startsWith(`${route}/`),
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  // Pe ecranele fără cont (start, login, înregistrare) apar doar logo-ul,
  // fără meniu și fără deconectare (#53).
  const isPublic = isPublicRoute(pathname);

  if (isPublic) {
    return (
      <header className="border-border bg-surface/90 sticky top-0 z-20 border-b backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center px-4 py-3">
          <Link href="/start" className="flex items-center gap-2.5 rounded-lg">
            <Logo className="size-8" />
            <span className="font-display text-xl font-extrabold tracking-tight">CacheFlow</span>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="border-border bg-surface/90 sticky top-0 z-20 border-b backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-8 px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5 rounded-lg">
            <Logo className="size-8" />
            <span className="font-display text-xl font-extrabold tracking-tight">CacheFlow</span>
          </Link>

          <nav aria-label="Navigare principală" className="hidden sm:block">
            <ul className="flex gap-1">
              {NAV_ITEMS.map((item) => {
                const active = isActive(pathname, item);
                const classes = `relative block px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors`;
                return (
                  <li key={item.label}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`${classes} rounded-lg ${active ? "text-foreground" : "text-muted hover:text-foreground"}`}
                      >
                        {item.label}
                        {active && (
                          <span
                            aria-hidden="true"
                            className="bg-here absolute inset-x-3 -bottom-3 h-0.5 rounded-full"
                          />
                        )}
                      </Link>
                    ) : (
                      <span
                        aria-disabled="true"
                        title="În curând"
                        className={`${classes} text-muted/60`}
                      >
                        {item.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Loc rezervat pentru butonul de deconectare (#53). */}
          <div className="ml-auto flex items-center gap-2">
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Pe telefon: bara de navigare jos, la îndemâna degetului mare. */}
      <nav
        aria-label="Navigare principală"
        className="border-border bg-surface/95 fixed inset-x-0 bottom-0 z-20 border-t backdrop-blur-md sm:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-4">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item);
            const content = (
              <>
                <item.Icon className="size-5" />
                <span className="text-[0.7rem] leading-tight font-semibold">{item.label}</span>
                {active && (
                  <span
                    aria-hidden="true"
                    className="bg-here absolute top-0 h-0.5 w-8 rounded-full"
                  />
                )}
              </>
            );
            const classes =
              "relative flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2";
            return (
              <li key={item.label}>
                {item.href ? (
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`${classes} ${active ? "text-foreground" : "text-muted"}`}
                  >
                    {content}
                  </Link>
                ) : (
                  <span aria-disabled="true" className={`${classes} text-muted/50`}>
                    {content}
                    <span className="sr-only">(în curând)</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
