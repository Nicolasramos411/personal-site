import { IconArrowUp } from "./Icon";

export function SiteFooter() {
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
          © 2026 Nicolás Ramos · Built between Santiago and Mexico City.
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
          <span>Back to top</span>
          <IconArrowUp size={10} />
        </a>
      </div>
    </footer>
  );
}
