import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import "./globals.css";

const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-host-grotesk",
});

export const metadata: Metadata = {
  title: "Monzer Hweit – AI Engineer",
  description:
    "AI engineer building retrieval systems, LLM pipelines and automations.",
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
