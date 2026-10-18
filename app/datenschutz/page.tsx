import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { content } from "@/content";

export const metadata: Metadata = {
  title: content.legal.datenschutz.title,
  alternates: { canonical: "/datenschutz" },
};

export default function Datenschutz() {
  return <LegalPage page={content.legal.datenschutz} />;
}
