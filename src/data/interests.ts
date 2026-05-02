export type InterestId = "ai-agents" | "fintech" | "stablecoins";

export type Interest = {
  id: InterestId;
  index: string;
  category: string;
  titleStart: string;
  titleAccent: string;
  description: string;
  tags: readonly string[];
};

export const interests: readonly Interest[] = [
  {
    id: "ai-agents",
    index: "01",
    category: "compute",
    titleStart: "AI ",
    titleAccent: "Agents",
    description:
      "Systems that don't just respond — they act. I'm fascinated by the design of autonomous agents that can reason, plan, and execute in real environments — and the new product paradigm this opens up.",
    tags: ["llms", "autonomy", "reasoning", "tool-use", "multi-agent"],
  },
  {
    id: "fintech",
    index: "02",
    category: "infra",
    titleStart: "Fin",
    titleAccent: "tech",
    description:
      "The financial infrastructure layer is being rewritten. I'm drawn to how software redesigns access to money — especially in markets where the traditional system fails.",
    tags: ["payments", "baas", "rails", "latam", "regulation"],
  },
  {
    id: "stablecoins",
    index: "03",
    category: "money",
    titleStart: "Stable",
    titleAccent: "coins",
    description:
      "The digital dollar that doesn't need a bank. Stablecoins are the most underrated piece of the future financial stack — and the one with the highest impact in volatile economies like Latin America.",
    tags: ["usdc", "on-chain", "dollarization", "liquidity", "web3"],
  },
] as const;
