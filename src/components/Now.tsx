"use client";

import { Section } from "./Section";
import { nowItems, nowUpdatedAt } from "@/data/now";
import { useLocale } from "./Locale";

export function NowPanel() {
  const { locale } = useLocale();
  const label = locale === "es" ? "Trabajo actual" : "Current work";
  const sub =
    locale === "es"
      ? "Lo que está sobre la mesa este mes."
      : "What's on the table this month.";
  const updated = locale === "es" ? "actualizado" : "updated";

  return (
    <Section id="now" label={label} index="§3">
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-12">
        <div className="flex flex-col gap-2">
          <p
            className="text-muted"
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "11.5px",
              letterSpacing: "0.04em",
              lineHeight: 1.5,
            }}
          >
            {sub}
          </p>
          <p
            className="text-muted"
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "11px",
              letterSpacing: "0.04em",
            }}
          >
            {updated} {nowUpdatedAt}
          </p>
        </div>

        <ul className="list-none p-0 m-0 border-t border-line">
          {nowItems.map((item) => (
            <li
              key={item.kind}
              className="grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr] gap-6 items-baseline py-6 sm:py-7 border-b border-line"
            >
              <span
                className="uppercase text-muted tabular-nums"
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                }}
              >
                {item.kind}
              </span>

              <div
                className="text-ink flex items-baseline gap-3 flex-wrap"
                style={{
                  fontSize: "clamp(17px, 1.5vw, 22px)",
                  lineHeight: 1.4,
                  letterSpacing: "-0.015em",
                  fontWeight: 400,
                }}
              >
                <span className="flex-1 min-w-0">
                  {locale === "es" ? item.text : item.textEn}
                </span>
                {item.meta ? (
                  <span
                    className="text-muted uppercase"
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "11px",
                      letterSpacing: "0.18em",
                    }}
                  >
                    [{item.meta}]
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
