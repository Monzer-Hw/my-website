import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { content } from "@/content";

export const metadata: Metadata = {
  title: content.legal.impressum.title,
  alternates: { canonical: "/impressum" },
};

export default function Impressum() {
  return <LegalPage page={content.legal.impressum} />;
}
