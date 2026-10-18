import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { content } from "@/content";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-host-grotesk",
});

const { name, role, description } = content.site;

// Link previews and search results (spec 3.9). The preview image is app/opengraph-image.tsx.
export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: { default: `${name} – ${role}`, template: `%s – ${name}` },
  description,
  authors: [{ name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: name,
    title: `${name} – ${role}`,
    description,
    locale: "en_US",
    url: "/",
  },
  twitter: { card: "summary_large_image", title: `${name} – ${role}`, description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={hostGrotesk.variable}>
      <body>
        <a
          href="#main"
          className="absolute -top-20 left-3 z-[100] rounded-ctl bg-ink px-4 py-2.5 text-bg no-underline focus:top-3"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
