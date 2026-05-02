import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Nicolás Ramos — What do you want to know?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          color: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "16px",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#6e6e6e",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              background: "#0a0a0a",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 22 22"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="#ffffff">
                <rect x="5" y="9" width="2.6" height="9" />
                <rect x="14.4" y="9" width="2.6" height="9" />
                <path d="M 5 9 L 7.6 9 L 17 18 L 14.4 18 Z" />
                <path
                  d="M 5.5 5.5 Q 8 3.5 11 5.5 T 16.5 5.5"
                  stroke="#ffffff"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            </svg>
          </span>
          <span>Nicolás Ramos · index 2026</span>
        </div>

        <div
          style={{
            marginTop: "auto",
            fontSize: "84px",
            lineHeight: 0.98,
            letterSpacing: "-0.04em",
            fontWeight: 500,
            maxWidth: "16ch",
            display: "flex",
          }}
        >
          What do you want to know about Nicolás?
        </div>

        <div
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#6e6e6e",
            fontSize: "18px",
            letterSpacing: "0.04em",
          }}
        >
          <span>Co-Founder & CTO · Xpendit</span>
          <span>Santiago ↔ CDMX</span>
        </div>
      </div>
    ),
    size,
  );
}
