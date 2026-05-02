"use client";

import { m, useReducedMotion, type Variants } from "framer-motion";
import { Section } from "./Section";
import { NumberTicker } from "./NumberTicker";

const LINES: readonly { num: string; lead: string; accent: string }[] = [
  { num: "01", lead: "Agents are now your", accent: "colleagues" },
  { num: "02", lead: "Rails are now", accent: "software" },
  { num: "03", lead: "The dollar fits in", accent: "your phone" },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const formatPad2 = (n: number) => String(n).padStart(2, "0");

export function Thesis() {
  const reduce = useReducedMotion();

  return (
    <Section id="thesis" label="Thesis" index="§1">
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
            Three observations from working at the edge of financial
            infrastructure and artificial intelligence.
          </p>
        </div>

        <m.div
          className="flex flex-col"
          variants={reduce ? undefined : containerVariants}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={{ once: true, margin: "-80px" }}
        >
          {LINES.map((l, i) => (
            <m.div
              key={l.num}
              variants={reduce ? undefined : lineVariants}
              className={`grid grid-cols-[40px_1fr] gap-6 items-baseline py-6 sm:py-8 ${
                i !== 0 ? "border-t border-line" : ""
              }`}
            >
              <NumberTicker
                value={parseInt(l.num, 10)}
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
              <p
                className="text-ink"
                style={{
                  fontSize: "clamp(28px, 4.4vw, 56px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  fontWeight: 500,
                }}
              >
                {l.lead}{" "}
                <span className="text-secondary italic">{l.accent}</span>
                <span className="text-faint">.</span>
              </p>
            </m.div>
          ))}
        </m.div>
      </div>
    </Section>
  );
}
