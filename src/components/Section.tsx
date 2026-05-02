import type { ReactNode } from "react";

type Props = {
  id?: string;
  label: string;
  index?: string;
  children: ReactNode;
};

export function Section({ id, label, index, children }: Props) {
  return (
    <section
      id={id}
      className="border-b border-line"
      style={{ scrollMarginTop: "calc(var(--nav-height) + 16px)" }}
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-12 py-16 sm:py-28">
        <header className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4 lg:gap-12 mb-10 sm:mb-16">
          <div className="flex items-baseline gap-3">
            {index ? (
              <span
                className="text-faint tabular-nums"
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                }}
              >
                {index}
              </span>
            ) : null}
            <h2
              className="uppercase text-ink m-0"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "11px",
                letterSpacing: "0.22em",
                fontWeight: 500,
              }}
            >
              {label}
            </h2>
          </div>
        </header>

        {children}
      </div>
    </section>
  );
}
