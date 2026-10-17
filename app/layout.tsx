import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monzer Hweit – AI Engineer",
  description:
    "AI engineer building retrieval systems, LLM pipelines and automations.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
