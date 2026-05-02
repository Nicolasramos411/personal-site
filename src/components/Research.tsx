"use client";

import { m, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "./Section";
import { NumberTicker } from "./NumberTicker";
import { interests } from "@/data/interests";
import { useLocale } from "./Locale";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const formatPad2 = (n: number) => String(n).padStart(2, "0");

export function Research() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const sub =
    locale === "es"
      ? "Tres dominios bajo observación activa. Cada uno con sus tags y vector de exploración."
      : "Three domains under active observation. Each with its own tags and exploration vector.";
  const label = locale === "es" ? "Áreas de research" : "Research areas";

  return (
    <Section id="research" label={label} index="§2">
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 lg:gap-12">
        <div>
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
        </div>

        <m.ul
          className="flex flex-col list-none p-0 m-0 border-t border-line"
          variants={reduce ? undefined : containerVariants}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={{ once: true, margin: "-80px" }}
        >
          {interests.map((item, i) => (
            <m.li
              key={item.id}
              id={`section-${item.id}`}
              variants={reduce ? undefined : itemVariants}
              className="border-b border-line"
              style={{
                scrollMarginTop: "calc(var(--nav-height) + 16px)",
              }}
            >
              <article className="grid grid-cols-[44px_1fr] sm:grid-cols-[60px_1fr_auto] gap-3 sm:gap-8 items-baseline py-7 sm:py-10">
                <NumberTicker
                  value={parseInt(item.index, 10)}
                  format={formatPad2}
                  duration={520}
                  delay={i * 60}
                  className="text-faint tabular-nums"
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "12px",
                    letterSpacing: "0.06em",
                  }}
                />

                <div className="flex flex-col gap-3 min-w-0">
                  <h3
                    className="text-ink"
                    style={{
                      fontSize: "clamp(26px, 3.6vw, 44px)",
                      lineHeight: 1.05,
                      letterSpacing: "-0.025em",
                      fontWeight: 500,
                      wordBreak: "break-word",
                    }}
                  >
                    {item.titleStart}
                    {item.titleAccent}
                  </h3>
                  <p
                    className="text-secondary"
                    style={{
                      fontSize: "15px",
                      lineHeight: 1.55,
                      maxWidth: "60ch",
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {locale === "es" ? item.description : item.descriptionEn}
                  </p>
                  <ul className="flex flex-wrap gap-x-3 gap-y-1 mt-2 list-none p-0 m-0">
                    {item.tags.map((tag) => (
                      <li
                        key={tag}
                        className="text-muted"
                        style={{
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: "11px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>

                <span
                  className="hidden sm:inline self-start uppercase text-muted"
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "11px",
                    letterSpacing: "0.18em",
                  }}
                >
                  {item.category}
                </span>
              </article>
            </m.li>
          ))}
        </m.ul>
      </div>
    </Section>
  );
}
