export type NowItem = {
  kind: string;
  text: string;
  meta?: string;
};

export const nowItems: readonly NowItem[] = [
  {
    kind: "building",
    text: "policy engine for corporate cards",
    meta: "xpendit",
  },
  {
    kind: "reading",
    text: "papers on tool-use and recoverable planning in agents",
  },
  {
    kind: "following",
    text: "usdc/eurc rails landing in latam",
  },
  {
    kind: "in",
    text: "cdmx until october, santiago after",
  },
];

export const nowUpdatedAt = "2026.05.01";
