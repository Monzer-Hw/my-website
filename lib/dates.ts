const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2025-03" → "Mar 2025". Pure string work, so it is safe in prerendered pages. */
export function formatYearMonth(value: string): string {
  const [year, month] = value.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

/** "2025-03" to "present" → "Mar 2025 – now" (the word for "present" comes from content). */
export function formatRange(start: string, end: string, presentLabel: string): string {
  return `${formatYearMonth(start)} – ${end === "present" ? presentLabel : formatYearMonth(end)}`;
}
