import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LocaleProvider } from "@/components/Locale";
import { MotionFeatures } from "@/components/MotionFeatures";
import "./globals.css";

const SITE_URL = "https://nicolasramos.dev";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Nicolás Ramos",
  description:
    "Co-Founder & CTO at Xpendit. Working between Santiago and Mexico City on AI agents, fintech infrastructure and stablecoins.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    title: "Nicolás Ramos — What do you want to know?",
    description:
      "Operator between Santiago and Mexico City. Building Xpendit, reading agent papers at 2am.",
    url: SITE_URL,
    siteName: "Nicolás Ramos",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nicolás Ramos — What do you want to know?",
    description:
      "Operator between Santiago and Mexico City. Co-Founder & CTO at Xpendit.",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Nicolás José Ramos Bascuñán",
  alternateName: "Nicolás Ramos",
  url: SITE_URL,
  jobTitle: "Co-Founder & CTO",
  worksFor: {
    "@type": "Organization",
    name: "Xpendit",
    url: "https://xpendit.com",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Pontificia Universidad Católica de Chile",
  },
  email: "mailto:nicolas@xpendit.com",
  nationality: "Chilean",
  knowsLanguage: ["es", "en"],
  knowsAbout: [
    "AI Agents",
    "Stablecoins",
    "Fintech Infrastructure",
    "LATAM Tech",
  ],
  sameAs: [
    "https://www.linkedin.com/in/nicolas-jose-ramos/",
    "https://xpendit.com",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <LocaleProvider>
          <MotionFeatures>
            <div
              className="relative min-h-screen text-ink bg-paper"
              style={{
                fontFamily:
                  "var(--font-sans), -apple-system, system-ui, sans-serif",
              }}
            >
              {children}
            </div>
          </MotionFeatures>
        </LocaleProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
