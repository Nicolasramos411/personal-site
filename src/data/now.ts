export type NowItem = {
  kind: string;
  text: string;
  textEn: string;
  meta?: string;
};

export const nowItems: readonly NowItem[] = [
  {
    kind: "building",
    text: "policy engine para corporate cards",
    textEn: "policy engine for corporate cards",
    meta: "xpendit",
  },
  {
    kind: "reading",
    text: "papers de tool-use y planning recoverable en agentes",
    textEn: "papers on tool-use and recoverable planning in agents",
  },
  {
    kind: "following",
    text: "usdc/eurc rails aterrizando en latam",
    textEn: "usdc/eurc rails landing in latam",
  },
  {
    kind: "in",
    text: "cdmx hasta octubre, santiago después",
    textEn: "cdmx until october, santiago after",
  },
];

export const nowUpdatedAt = "2026.05.01";
