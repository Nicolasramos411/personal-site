"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { m, useReducedMotion, type Variants } from "framer-motion";

export type ActionChip = { label: string; href: string };

export type Parsed = {
  text: string;
  chips: ActionChip[];
};

const chipContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const chipVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
};

export function AssistantMessage({
  parsed,
  showCursor,
}: {
  parsed: Parsed;
  showCursor: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className="text-ink"
      style={{
        fontSize: "15px",
        lineHeight: 1.55,
        letterSpacing: "-0.005em",
        overflowWrap: "anywhere",
      }}
    >
      {parsed.text ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children, ...props }) => {
              const isExternal =
                typeof href === "string" && /^https?:\/\//.test(href);
              return (
                <a
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="underline underline-offset-4 decoration-line-strong hover:decoration-ink"
                  {...props}
                >
                  {children}
                </a>
              );
            },
            p: ({ children }) => (
              <p style={{ margin: "0 0 0.6em 0" }}>{children}</p>
            ),
            code: ({ children }) => (
              <code
                style={{
                  background: "var(--color-canvas)",
                  padding: "1px 6px",
                  borderRadius: "4px",
                  fontSize: "0.92em",
                  fontFamily: "var(--font-mono), monospace",
                }}
              >
                {children}
              </code>
            ),
            ul: ({ children }) => (
              <ul style={{ margin: "0.4em 0 0.6em 1.1em", padding: 0 }}>
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol style={{ margin: "0.4em 0 0.6em 1.4em", padding: 0 }}>
                {children}
              </ol>
            ),
          }}
        >
          {parsed.text}
        </ReactMarkdown>
      ) : (
        <span className="text-faint">…</span>
      )}
      {showCursor ? (
        <span
          aria-hidden="true"
          className="site-blink inline-block align-middle ml-1"
          style={{
            width: "8px",
            height: "16px",
            background: "var(--color-ink)",
            verticalAlign: "-3px",
          }}
        />
      ) : null}
      {parsed.chips.length > 0 && !showCursor ? (
        <m.div
          className="mt-3 flex flex-wrap gap-2"
          variants={reduce ? undefined : chipContainerVariants}
          initial={reduce ? false : "hidden"}
          animate={reduce ? undefined : "visible"}
        >
          {parsed.chips.map((c) => {
            const isExternal = /^https?:\/\//.test(c.href);
            return (
              <m.a
                key={`${c.label}-${c.href}`}
                variants={reduce ? undefined : chipVariants}
                href={c.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1.5 border border-line-strong hover:border-ink hover:bg-canvas active:scale-[0.97] transition-all text-ink"
                style={{
                  fontSize: "13px",
                  letterSpacing: "0.02em",
                  padding: "12px 18px",
                  borderRadius: "999px",
                  minHeight: "44px",
                }}
              >
                {c.label}
                {isExternal ? (
                  <span aria-hidden="true" className="text-muted">
                    ↗
                  </span>
                ) : null}
              </m.a>
            );
          })}
        </m.div>
      ) : null}
    </div>
  );
}
