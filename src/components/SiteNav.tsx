"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { IconMark } from "./Icon";

const LINKS: readonly { href: string; id: string; label: string; short: string }[] = [
  { href: "#thesis", id: "thesis", label: "Thesis", short: "§1" },
  { href: "#research", id: "research", label: "Research", short: "§2" },
  { href: "#now", id: "now", label: "Now", short: "§3" },
  { href: "#profile", id: "profile", label: "Profile", short: "§4" },
];

export function SiteNav() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const sections = LINKS
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className="sticky top-0 z-40 border-b border-line bg-paper/85"
      style={{
        backdropFilter: "saturate(140%) blur(8px)",
        WebkitBackdropFilter: "saturate(140%) blur(8px)",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <div
        className="mx-auto max-w-[1280px] px-5 sm:px-12 flex items-center justify-between gap-3"
        style={{ height: "var(--nav-height)" }}
      >
        <Link
          href="/"
          aria-label="Nicolás Ramos — home"
          className="flex items-center gap-2.5 text-ink hover:opacity-70 transition-opacity py-2 shrink-0"
          style={{ fontSize: "13px", letterSpacing: "0.02em" }}
        >
          <span
            aria-hidden="true"
            className="inline-flex items-center justify-center bg-ink text-white"
            style={{ width: "22px", height: "22px" }}
          >
            <IconMark size={22} />
          </span>
          <span className="font-medium hidden min-[400px]:inline">
            Nicolás Ramos
          </span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-6">
          {LINKS.map((l) => {
            const isActive = activeId === l.id;
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? "true" : undefined}
                aria-label={l.label}
                className={`relative py-3 transition-colors ${
                  isActive ? "text-ink" : "text-secondary hover:text-ink"
                }`}
                style={{ fontSize: "12.5px", letterSpacing: "0.02em" }}
              >
                <span className="sm:hidden tabular-nums" aria-hidden="true">
                  {l.short}
                </span>
                <span className="hidden sm:inline">{l.label}</span>
                {isActive ? (
                  <m.span
                    layoutId="nav-underline"
                    aria-hidden="true"
                    className="absolute left-0 right-0"
                    style={{
                      bottom: "-1px",
                      height: "1.5px",
                      background: "var(--color-ink)",
                    }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 380, damping: 32 }
                    }
                  />
                ) : null}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
