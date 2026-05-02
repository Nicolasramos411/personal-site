export type InterestId = "ai-agents" | "fintech" | "stablecoins";
export type Tone = "warm" | "neutral" | "cool";

export type Interest = {
  id: InterestId;
  index: string;
  shortcut: string;
  category: string;
  tone: Tone;
  titleStart: string;
  titleAccent: string;
  accentSuffix: boolean;
  description: string;
  descriptionEn: string;
  tags: readonly string[];
};

export const TONE_HEX: Record<Tone, string> = {
  warm: "#e0b56a",
  neutral: "#d4a85a",
  cool: "#b0aaa0",
};

export const interests: readonly Interest[] = [
  {
    id: "ai-agents",
    index: "01",
    shortcut: "⌘1",
    category: "compute",
    tone: "warm",
    titleStart: "AI ",
    titleAccent: "Agents",
    accentSuffix: true,
    description:
      "Sistemas que no sólo responden, actúan. Me fascina el diseño de agentes autónomos capaces de razonar, planificar y ejecutar en entornos reales — y el nuevo paradigma de producto que esto abre.",
    descriptionEn:
      "Systems that don't just respond — they act. I'm fascinated by the design of autonomous agents that can reason, plan, and execute in real environments — and the new product paradigm this opens up.",
    tags: ["llms", "autonomy", "reasoning", "tool-use", "multi-agent"],
  },
  {
    id: "fintech",
    index: "02",
    shortcut: "⌘2",
    category: "infra",
    tone: "neutral",
    titleStart: "Fin",
    titleAccent: "tech",
    accentSuffix: true,
    description:
      "La capa de infraestructura financiera está siendo reescrita. Me interesa cómo el software rediseña el acceso al dinero — especialmente en mercados donde el sistema tradicional falla.",
    descriptionEn:
      "The financial infrastructure layer is being rewritten. I'm drawn to how software redesigns access to money — especially in markets where the traditional system fails.",
    tags: ["payments", "baas", "rails", "latam", "regulation"],
  },
  {
    id: "stablecoins",
    index: "03",
    shortcut: "⌘3",
    category: "money",
    tone: "cool",
    titleStart: "Stable",
    titleAccent: "coins",
    accentSuffix: true,
    description:
      "El dólar digital que no necesita un banco. Las stablecoins son la pieza más subestimada del stack financiero del futuro — y la que más impacto puede tener en economías volátiles como la latinoamericana.",
    descriptionEn:
      "The digital dollar that doesn't need a bank. Stablecoins are the most underrated piece of the future financial stack — and the one with the highest impact in volatile economies like Latin America.",
    tags: ["usdc", "on-chain", "dollarization", "liquidity", "web3"],
  },
] as const;
