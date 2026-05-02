"use client";

import { Section } from "./Section";
import { IconArrowUpRight } from "./Icon";
import { useLocale, type Locale } from "./Locale";

type Row = {
  labelEn: string;
  labelEs: string;
  valueEn: string;
  valueEs: string;
  href?: string;
};

const ROWS: readonly Row[] = [
  { labelEn: "Name", labelEs: "Nombre", valueEn: "Nicolás José Ramos Bascuñán", valueEs: "Nicolás José Ramos Bascuñán" },
  {
    labelEn: "Role",
    labelEs: "Rol",
    valueEn: "Co-Founder & CTO at Xpendit · since 2023",
    valueEs: "Co-Founder & CTO en Xpendit · desde 2023",
  },
  {
    labelEn: "Xpendit",
    labelEs: "Xpendit",
    valueEn: "AI-native expense management for LATAM",
    valueEs: "Gestión de gastos AI-native para LATAM",
    href: "https://xpendit.com",
  },
  {
    labelEn: "Based",
    labelEs: "Vivo en",
    valueEn: "Santiago, CL ↔ Mexico City, MX",
    valueEs: "Santiago, CL ↔ Ciudad de México, MX",
  },
  {
    labelEn: "Education",
    labelEs: "Educación",
    valueEn: "Engineering · Pontificia Universidad Católica de Chile · 2020–2025",
    valueEs: "Ingeniería · Pontificia Universidad Católica de Chile · 2020–2025",
  },
  {
    labelEn: "Community",
    labelEs: "Comunidad",
    valueEn: "Founder @ u25f · LatAm under-25 founders",
    valueEs: "Founder @ u25f · founders LatAm sub-25",
  },
  {
    labelEn: "Languages",
    labelEs: "Idiomas",
    valueEn: "Spanish · English",
    valueEs: "Español · Inglés",
  },
  {
    labelEn: "Email",
    labelEs: "Email",
    valueEn: "nicolas@xpendit.com",
    valueEs: "nicolas@xpendit.com",
    href: "mailto:nicolas@xpendit.com",
  },
  {
    labelEn: "LinkedIn",
    labelEs: "LinkedIn",
    valueEn: "linkedin.com/in/nicolas-jose-ramos",
    valueEs: "linkedin.com/in/nicolas-jose-ramos",
    href: "https://www.linkedin.com/in/nicolas-jose-ramos/",
  },
  { labelEn: "Year", labelEs: "Año", valueEn: "2026", valueEs: "2026" },
];

function pickRow(r: Row, locale: Locale) {
  return locale === "es"
    ? { label: r.labelEs, value: r.valueEs }
    : { label: r.labelEn, value: r.valueEn };
}

export function Profile() {
  const { locale } = useLocale();
  const sub =
    locale === "es"
      ? "Datos verificables. Para todo lo demás, escríbeme."
      : "Verifiable facts. For everything else, say hi.";
  const sectionLabel = locale === "es" ? "Perfil" : "Profile";

  return (
    <Section id="profile" label={sectionLabel} index="§4">
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

        <dl className="m-0 border-t border-line">
          {ROWS.map((r) => {
            const { label, value } = pickRow(r, locale);
            return (
              <div
                key={r.labelEn}
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
                  {label}
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
                      rel={r.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 hover:underline underline-offset-4"
                    >
                      <span>{value}</span>
                      {r.href.startsWith("http") ? (
                        <IconArrowUpRight size={11} className="text-muted" />
                      ) : null}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </Section>
  );
}
