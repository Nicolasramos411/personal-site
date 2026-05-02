"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  AnimatePresence,
  m,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useLocale } from "./Locale";

const AssistantMessage = dynamic(
  () => import("./AssistantMessage").then((mod) => mod.AssistantMessage),
  { ssr: false },
);

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS_BY_LOCALE = {
  en: [
    "Who are you?",
    "What are you building at Xpendit?",
    "Why stablecoins?",
    "Santiago or Mexico City?",
  ],
  es: [
    "¿Quién eres?",
    "¿Qué estás construyendo en Xpendit?",
    "¿Por qué stablecoins?",
    "¿Santiago o Ciudad de México?",
  ],
} as const;

const STORAGE_KEY = "chat-conversation";
const STORAGE_TTL_MS = 1000 * 60 * 60 * 24;

const SHARE_HASH_PREFIX = "#share=";
const ALLOWED_ACTION_PREFIXES = [
  "mailto:",
  "https://www.linkedin.com/in/nicolas-jose-ramos",
  "https://xpendit.com",
  "https://odoo.xpendit.com/jobs",
  "/#",
];

type ActionChip = { label: string; href: string };

type Parsed = {
  text: string;
  chips: ActionChip[];
};

const ACTION_RE = /\[ACTION:([^|\]]+)\|([^\]]+)\]/g;

function parseActions(content: string): Parsed {
  const chips: ActionChip[] = [];
  const text = content
    .replace(ACTION_RE, (_full, label: string, href: string) => {
      const trimmedHref = href.trim();
      const isAllowed = ALLOWED_ACTION_PREFIXES.some((p) =>
        trimmedHref.startsWith(p),
      );
      if (isAllowed) {
        chips.push({ label: label.trim(), href: trimmedHref });
      }
      return "";
    })
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return { text, chips };
}

function SendIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="2" y1="7" x2="12" y2="7" />
      <polyline points="8 3 12 7 8 11" />
    </svg>
  );
}

function SpinnerIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className="site-rotate"
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="5" strokeDasharray="4 3" strokeLinecap="round" />
    </svg>
  );
}

type ChatMode = "groq" | "mock" | null;

function loadStored(): Message[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { savedAt: number; messages: Message[] };
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > STORAGE_TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return Array.isArray(parsed.messages) ? parsed.messages : null;
  } catch {
    return null;
  }
}

function decodeShared(): Message[] | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash;
  if (!hash.startsWith(SHARE_HASH_PREFIX)) return null;
  try {
    const b64 = hash.slice(SHARE_HASH_PREFIX.length);
    const padded = b64.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(padded);
    const parsed = JSON.parse(json) as Message[];
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string",
    );
  } catch {
    return null;
  }
}

function encodeShare(messages: Message[]): string {
  const json = JSON.stringify(messages.slice(-6));
  const b64 = btoa(json).replace(/\+/g, "-").replace(/\//g, "_");
  return `${window.location.origin}${window.location.pathname}${SHARE_HASH_PREFIX}${b64}`;
}

const titleContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};

const titleWordVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
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

export function ChatHero() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>(null);
  const [model, setModel] = useState<string | null>(null);
  const [lastError, setLastError] = useState<{ messages: Message[] } | null>(
    null,
  );
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [isViewingShared, setIsViewingShared] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shared = decodeShared();
    if (shared && shared.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration from URL hash; not available during SSR
      setMessages(shared);
      setIsViewingShared(true);
    } else {
      const stored = loadStored();
      if (stored && stored.length > 0) setMessages(stored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || isViewingShared) return;
    if (messages.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ savedAt: Date.now(), messages }),
      );
    } catch {}
  }, [messages, hydrated, isViewingShared]);

  const adjustHeight = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    ta.style.height = `${Math.min(ta.scrollHeight, 180)}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [input, adjustHeight]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        textareaRef.current?.focus();
        textareaRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      if (e.key === "Escape" && document.activeElement === textareaRef.current) {
        textareaRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const runChat = useCallback(async (history: Message[]) => {
    setIsLoading(true);
    setLastError(null);
    setMessages([...history, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (res.status === 429) {
        throw new Error("rate limited — try again in a minute");
      }
      if (!res.ok || !res.body) throw new Error(`status ${res.status}`);

      const headerMode = res.headers.get("X-Mode");
      const headerModel = res.headers.get("X-Model");
      setMode(headerMode === "groq" ? "groq" : "mock");
      setModel(headerModel);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (!last || last.role !== "assistant") return prev;
          return [...prev.slice(0, -1), { role: "assistant", content: acc }];
        });
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong.";
      setLastError({ messages: history });
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (!last || last.role !== "assistant") return prev;
        return [
          ...prev.slice(0, -1),
          { role: "assistant", content: `Couldn't reach the endpoint — ${msg}` },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const send = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || isLoading) return;
      if (isViewingShared) {
        clearShareHash();
        setIsViewingShared(false);
        setMessages([]);
        await runChat([{ role: "user", content: text }]);
      } else {
        setInput("");
        const history = [...messages, { role: "user", content: text } as Message];
        await runChat(history);
      }
    },
    [messages, isLoading, isViewingShared, runChat],
  );

  const retry = useCallback(async () => {
    if (!lastError || isLoading) return;
    await runChat(lastError.messages);
  }, [lastError, isLoading, runChat]);

  const clear = useCallback(() => {
    setMessages([]);
    setLastError(null);
    setMode(null);
    setModel(null);
    setIsViewingShared(false);
    clearShareHash();
    window.localStorage.removeItem(STORAGE_KEY);
    textareaRef.current?.focus();
  }, []);

  const share = useCallback(async () => {
    if (messages.length === 0) return;
    const url = encodeShare(messages);
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      window.prompt("Copy this URL:", url);
    }
  }, [messages]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const canSend = input.trim().length > 0 && !isLoading;
  const showSuggestions = messages.length === 0;
  const suggestions = SUGGESTIONS_BY_LOCALE[locale];

  const t = useMemo(() => {
    if (locale === "es") {
      return {
        title: "¿Qué quieres saber sobre Nicolás?",
        intro:
          "Un operador entre Santiago y Ciudad de México. Construye infraestructura financiera de día y lee papers de agentes a las 2am. Pregúntame lo que quieras — o desliza para ver las secciones.",
        placeholder: "Pregunta lo que quieras… (Enter para enviar, Shift+Enter nueva línea)",
        ariaLabel: "Pregúntale a Nicolás",
        clear: "← borrar conversación",
        share: "compartir conversación",
        shareCopied: "✓ link copiado",
        retry: "Reintentar",
        sharedBanner:
          "Estás viendo una conversación compartida (solo lectura). Pregunta algo nuevo para retomar.",
        ready: "listo · pregúntame algo",
        live: "en vivo",
        demo: "modo demo",
        demoNote: "respuestas locales",
        liveNote: "powered by groq + ai sdk",
        kbHint: "⌘K para enfocar",
      };
    }
    return {
      title: "What do you want to know about Nicolás?",
      intro:
        "An operator between Santiago and Mexico City. I build financial infrastructure by day and read agent papers at 2am. Ask me anything — or scroll for the sections below.",
      placeholder: "Ask me anything… (Enter to send, Shift+Enter for newline)",
      ariaLabel: "Ask Nicolás anything",
      clear: "← clear conversation",
      share: "share conversation",
      shareCopied: "✓ link copied",
      retry: "Retry",
      sharedBanner:
        "You're viewing a shared conversation (read-only). Ask something to start a new one.",
      ready: "ready · ask anything",
      live: "live",
      demo: "demo mode",
      demoNote: "responses sampled locally",
      liveNote: "powered by groq + ai sdk",
      kbHint: "⌘K to focus",
    };
  }, [locale]);

  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-12 pt-24 sm:pt-32 pb-20 sm:pb-28">
        <div
          className="uppercase text-muted mb-8"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: "11px",
            letterSpacing: "0.22em",
          }}
        >
          / index — 2026
        </div>

        <m.h1
          key={`title-${locale}`}
          className="text-ink"
          style={{
            fontSize: "clamp(40px, 6.6vw, 92px)",
            lineHeight: 0.98,
            letterSpacing: "-0.04em",
            fontWeight: 500,
            maxWidth: "18ch",
          }}
          variants={reduce ? undefined : titleContainerVariants}
          initial={reduce ? false : "hidden"}
          animate={reduce ? undefined : "visible"}
        >
          {t.title.split(" ").map((word, i) => (
            <m.span
              key={`${word}-${i}`}
              variants={reduce ? undefined : titleWordVariants}
              style={{ display: "inline-block", marginRight: "0.25em" }}
            >
              {word}
            </m.span>
          ))}
        </m.h1>

        <p
          className="mt-8 text-secondary max-w-[640px]"
          style={{
            fontSize: "clamp(15px, 1.3vw, 18px)",
            lineHeight: 1.55,
            letterSpacing: "-0.005em",
          }}
        >
          {t.intro}
        </p>

        {isViewingShared ? (
          <div
            className="mt-8 max-w-[760px] border-l-2 border-ink pl-4 py-2 text-secondary"
            style={{ fontSize: "13px", lineHeight: 1.5 }}
          >
            {t.sharedBanner}
          </div>
        ) : null}

        <m.div
          className="mt-12 max-w-[760px]"
          layout={reduce ? false : "position"}
          transition={reduce ? { duration: 0 } : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <m.div
            layout={reduce ? false : true}
            className="relative bg-paper border border-line-strong overflow-hidden"
            style={{
              borderRadius: "14px",
              boxShadow:
                "0 1px 0 rgba(10,10,10,0.02), 0 8px 24px -12px rgba(10,10,10,0.08)",
            }}
          >
            {messages.length > 0 ? (
              <div
                ref={logRef}
                role="log"
                aria-live="polite"
                aria-label="Conversation"
                className="max-h-[420px] overflow-y-auto border-b border-line"
                style={{ scrollbarWidth: "thin" }}
              >
                {messages.map((m, i) => {
                  const isLastAssistant =
                    m.role === "assistant" && i === messages.length - 1;
                  const parsed =
                    m.role === "assistant"
                      ? parseActions(m.content)
                      : { text: m.content, chips: [] };
                  return (
                    <div
                      key={i}
                      className={`px-5 py-4 ${i !== 0 ? "border-t border-line" : ""}`}
                    >
                      <div
                        className="uppercase text-muted mb-2"
                        style={{
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: "10.5px",
                          letterSpacing: "0.18em",
                        }}
                      >
                        {m.role === "user"
                          ? locale === "es" ? "tú" : "you"
                          : mode === "groq"
                            ? `nico · groq · ${model ?? "llama"}`
                            : "nico · demo"}
                      </div>
                      {m.role === "assistant" ? (
                        <AssistantMessage
                          parsed={parsed}
                          showCursor={isLastAssistant && isLoading}
                        />
                      ) : (
                        <div
                          className="text-ink"
                          style={{
                            fontSize: "15px",
                            lineHeight: 1.55,
                            letterSpacing: "-0.005em",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {m.content}
                        </div>
                      )}
                      {lastError && isLastAssistant && !isLoading ? (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={retry}
                            className="inline-flex items-center gap-2 border border-line-strong hover:border-ink hover:bg-canvas transition-colors text-ink active:scale-95"
                            style={{
                              fontSize: "12.5px",
                              letterSpacing: "-0.005em",
                              padding: "8px 14px",
                              borderRadius: "999px",
                              minHeight: "36px",
                            }}
                          >
                            {t.retry}
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}

            <div className="flex items-end gap-3 px-4 py-3">
              <label htmlFor="chat-input" className="sr-only">
                {t.ariaLabel}
              </label>
              <textarea
                id="chat-input"
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={t.placeholder}
                rows={1}
                disabled={isLoading}
                autoComplete="off"
                spellCheck={false}
                className="flex-1 resize-none bg-transparent outline-none text-ink placeholder:text-faint disabled:opacity-50"
                style={{
                  fontSize: "15px",
                  lineHeight: 1.5,
                  letterSpacing: "-0.005em",
                  minHeight: "28px",
                  maxHeight: "180px",
                  fontFamily: "inherit",
                }}
              />
              <button
                type="button"
                onClick={() => send(input)}
                disabled={!canSend}
                aria-label="Send message"
                className="flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:opacity-90 enabled:active:scale-95"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: canSend
                    ? "var(--color-ink)"
                    : "var(--color-line)",
                  color: canSend ? "var(--color-paper)" : "var(--color-muted)",
                }}
              >
                {isLoading ? <SpinnerIcon size={14} /> : <SendIcon size={14} />}
              </button>
            </div>
          </m.div>

          <AnimatePresence mode="wait" initial={false}>
            {showSuggestions ? (
              <m.div
                key="suggestions"
                className="mt-5 flex flex-wrap gap-2"
                variants={reduce ? undefined : chipContainerVariants}
                initial={reduce ? false : "hidden"}
                animate={reduce ? undefined : "visible"}
                exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.15 } }}
              >
                {suggestions.map((s) => (
                  <m.button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    disabled={isLoading}
                    variants={reduce ? undefined : chipVariants}
                    className="border border-line hover:border-line-strong hover:bg-canvas active:scale-[0.97] transition-all text-secondary hover:text-ink disabled:opacity-50 disabled:cursor-not-allowed bg-paper"
                    style={{
                      fontSize: "13px",
                      letterSpacing: "-0.005em",
                      padding: "10px 16px",
                      borderRadius: "999px",
                      minHeight: "40px",
                    }}
                  >
                    {s}
                  </m.button>
                ))}
              </m.div>
            ) : (
              <m.div
                key="actions"
                className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2"
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.15 } }}
                transition={reduce ? undefined : { duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  type="button"
                  onClick={clear}
                  disabled={isLoading}
                  className="text-muted hover:text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed py-2"
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: "11.5px",
                    letterSpacing: "0.08em",
                  }}
                >
                  {t.clear}
                </button>
                {!isViewingShared ? (
                  <button
                    type="button"
                    onClick={share}
                    disabled={isLoading}
                    className="text-muted hover:text-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed py-2"
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: "11.5px",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {copyState === "copied" ? t.shareCopied : t.share}
                  </button>
                ) : null}
              </m.div>
            )}
          </AnimatePresence>

          <div
            className="mt-6 text-muted flex flex-wrap items-center gap-2"
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: "10.5px",
              letterSpacing: "0.16em",
            }}
          >
            <span
              className="site-pulse inline-block"
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "9999px",
                background:
                  mode === "groq"
                    ? "var(--color-ink)"
                    : "var(--color-faint)",
              }}
              aria-hidden="true"
            />
            {mode === "groq" ? (
              <>
                <span className="uppercase">
                  {t.live} · groq · {model ?? "llama"}
                </span>
                <span aria-hidden="true">·</span>
                <span>{t.liveNote}</span>
              </>
            ) : mode === "mock" ? (
              <>
                <span className="uppercase">{t.demo}</span>
                <span aria-hidden="true">·</span>
                <span>{t.demoNote}</span>
              </>
            ) : (
              <>
                <span className="uppercase">{t.ready}</span>
                <span aria-hidden="true">·</span>
                <span>{t.liveNote}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{t.kbHint}</span>
          </div>
        </m.div>
      </div>
    </section>
  );
}

function clearShareHash() {
  if (typeof window === "undefined") return;
  if (window.location.hash.startsWith(SHARE_HASH_PREFIX)) {
    history.replaceState(null, "", window.location.pathname);
  }
}

