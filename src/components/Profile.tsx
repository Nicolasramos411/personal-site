import { Section } from "./Section";
import { IconArrowUpRight } from "./Icon";

type Row = {
  label: string;
  value: string;
  href?: string;
};

const ROWS: readonly Row[] = [
  { label: "Name", value: "Nicolás José Ramos Bascuñán" },
  { label: "Role", value: "Co-Founder & CTO at Xpendit · since 2023" },
  {
    label: "Xpendit",
    value: "Building a world where corporate spending manages itself",
    href: "https://xpendit.com",
  },
  { label: "Based", value: "Santiago, CL ↔ Mexico City, MX" },
  {
    label: "Education",
    value: "Engineering · Pontificia Universidad Católica de Chile · 2020–2025",
  },
  {
    label: "Community",
    value: "Founder @ u25f · LatAm under-25 founders",
  },
  { label: "Languages", value: "Spanish · English" },
  {
    label: "Email",
    value: "nicolas@xpendit.com",
    href: "mailto:nicolas@xpendit.com",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/nicolas-jose-ramos",
    href: "https://www.linkedin.com/in/nicolas-jose-ramos/",
  },
  { label: "Year", value: "2026" },
];

export function Profile() {
  return (
    <Section id="profile" label="Profile" index="§4">
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
            Verifiable facts. For everything else, say hi.
          </p>
        </div>

        <dl className="m-0 border-t border-line">
          {ROWS.map((r) => (
            <div
              key={r.label}
              className="grid grid-cols-[100px_1fr] sm:grid-cols-[180px_1fr] gap-4 sm:gap-6 items-baseline py-5 border-b border-line"
            >
              <dt
                className="uppercase text-muted"
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                }}
              >
                {r.label}
              </dt>
              <dd
                className="m-0 text-ink min-w-0"
                style={{
                  fontSize: "clamp(15px, 1.3vw, 18px)",
                  lineHeight: 1.4,
                  letterSpacing: "-0.005em",
                  overflowWrap: "anywhere",
                }}
              >
                {r.href ? (
                  <a
                    href={r.href}
                    target={r.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      r.href.startsWith("http") ? "noopener noreferrer" : undefined
                    }
                    className="inline-flex items-center gap-1.5 hover:underline underline-offset-4"
                  >
                    <span>{r.value}</span>
                    {r.href.startsWith("http") ? (
                      <IconArrowUpRight size={11} className="text-muted" />
                    ) : null}
                  </a>
                ) : (
                  r.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
