import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="180"
          height="180"
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
      </div>
    ),
    size,
  );
}
