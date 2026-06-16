"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { Home, Archive, User } from "lucide-react";

const IMMERSIVE_PREFIXES = [
  "/lesson", "/pattern-lab", "/call", "/story",
  "/texting", "/review", "/onboarding", "/waitlist", "/parent/setup",
];

const tabs = [
  { href: "/home",      label: "Home",       icon: Home    },
  { href: "/inventory", label: "Roots Bank", icon: Archive },
  { href: "/profile",   label: "Profile",    icon: User    },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const startX = useRef<number | null>(null);

  if (IMMERSIVE_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  const activeIndex = tabs.findIndex(
    (t) => pathname === t.href || pathname.startsWith(t.href + "/"),
  );

  function onPointerDown(e: React.PointerEvent) {
    startX.current = e.clientX;
  }

  function onPointerUp(e: React.PointerEvent) {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) < 40) return; // a tap, not a swipe

    const from = activeIndex < 0 ? 0 : activeIndex;
    // swipe left → next tab, swipe right → previous tab
    const next = Math.max(0, Math.min(tabs.length - 1, from + (dx < 0 ? 1 : -1)));
    if (next !== from) router.push(tabs[next].href);
  }

  return (
    <div
      className="px-5 pt-3"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <nav
        className="emboss flex items-center justify-around rounded-full px-5 py-2.5"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        style={{ touchAction: "pan-y" }}
      >
        {tabs.map(({ href, label, icon: Icon }, i) => {
          const isActive = i === activeIndex;

          if (isActive) {
            return (
              <div
                key={href}
                className="-my-1"
                style={{
                  padding: "1.5px",
                  background: "linear-gradient(135deg, #F4C98E 0%, #E89048 35%, #D2641E 65%, #8A2A0C 100%)",
                  borderRadius: "1.55rem",
                }}
              >
                <Link
                  href={href}
                  aria-label={label}
                  aria-current="page"
                  className="flex items-center justify-center w-14 h-14 text-text-primary"
                  style={{
                    background: "var(--surface)",
                    borderRadius: "1.45rem",
                    boxShadow:
                      "5px 5px 12px var(--shadow-dark), -5px -5px 12px var(--shadow-light)," +
                      "inset 0 0 10px 2px rgba(232,146,76,0.35)," +
                      "inset 0 0 24px 7px rgba(180,72,20,0.18)",
                  }}
                >
                  <Icon size={21} strokeWidth={2} />
                </Link>
              </div>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className="flex items-center justify-center w-12 h-12 text-text-primary hover:text-accent transition-colors"
            >
              <Icon size={21} strokeWidth={1.8} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
