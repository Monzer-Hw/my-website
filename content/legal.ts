import type { LegalPage } from "./schema";

// PLACEHOLDER: outlines what the legal texts must cover (intent/spec.md 3.10). Before launch,
// generate both texts with datenschutz-generator.de (free for private individuals; keep the
// required link back) and replace these sections. The launch guard blocks production until then.

export const legal: { impressum: LegalPage; datenschutz: LegalPage } = {
  impressum: {
    placeholder: true,
    title: "Impressum",
    sections: [
      {
        heading: "Angaben gemäß § 5 DDG",
        paragraphs: [
          "Monzer Hweit",
          "[Ladungsfähige Anschrift: wird vor dem Start ergänzt. Kein Postfach; eine c/o-Adresse nur, wenn Post dort tatsächlich ankommt.]",
        ],
      },
      {
        heading: "Kontakt",
        paragraphs: ["E-Mail: [wird vor dem Start ergänzt]"],
      },
      {
        heading: "Hinweis",
        paragraphs: ["Platzhalter: Dieser Text wird vor dem Start mit einem Generator erstellt und ersetzt."],
      },
    ],
  },
  datenschutz: {
    placeholder: true,
    title: "Datenschutzerklärung",
    sections: [
      {
        heading: "Verantwortlicher",
        paragraphs: ["Monzer Hweit, Kontaktdaten wie im Impressum."],
      },
      {
        heading: "Hosting",
        paragraphs: [
          "[Vercel Inc.: Server-Logs mit IP-Adressen; Übermittlung in die USA auf Grundlage des EU-US Data Privacy Framework und des Data Processing Addendum.]",
        ],
      },
      {
        heading: "Kontaktformular",
        paragraphs: [
          "[Erhobene Daten (Name, E-Mail-Adresse, Nachricht), Zweck (Beantwortung der Anfrage), Rechtsgrundlage, Versand über Resend (EU-Region), Speicherdauer.]",
        ],
      },
      {
        heading: "Schriftarten und Videos",
        paragraphs: [
          "[Schriftarten werden von dieser Website selbst ausgeliefert; es werden keine Daten an Google übertragen. Videos: je nach Hosting-Entscheidung.]",
        ],
      },
      {
        heading: "Ihre Rechte",
        paragraphs: [
          "[Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Datenübertragbarkeit und Beschwerde bei einer Datenschutz-Aufsichtsbehörde.]",
        ],
      },
      {
        heading: "Hinweis",
        paragraphs: ["Platzhalter: Dieser Text wird vor dem Start mit einem Generator erstellt und ersetzt."],
      },
    ],
  },
};
