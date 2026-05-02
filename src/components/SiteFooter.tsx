"use client";

import { IconArrowUp } from "./Icon";
import { useLocale } from "./Locale";

export function SiteFooter() {
  const { locale } = useLocale();
  const tagline =
    locale === "es"
      ? "© 2026 Nicolás Ramos · Construido entre Santiago y Ciudad de México."
      : "© 2026 Nicolás Ramos · Built between Santiago and Mexico City.";
  const top = locale === "es" ? "Volver arriba" : "Back to top";

  return (
    <footer>
      <div className="mx-auto max-w-[1280px] px-6 sm:px-12 py-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div
          className="text-muted"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "11.5px",
            letterSpacing: "0.04em",
          }}
        >
          {tagline}
        </div>

        <a
          href="#top"
          className="inline-flex items-center gap-1.5 py-2 text-muted hover:text-ink transition-colors"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "11.5px",
            letterSpacing: "0.04em",
          }}
        >
          <span>{top}</span>
          <IconArrowUp size={10} />
        </a>
      </div>
    </footer>
  );
}
