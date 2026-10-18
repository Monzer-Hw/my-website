/** "2:14" → "2 minutes 14 seconds", for screen readers (the screen shows "2:14"). */
export function durationLabel(value: string): string {
  const [m, s] = value.split(":").map(Number);
  const parts: string[] = [];
  if (m > 0) parts.push(`${m} ${m === 1 ? "minute" : "minutes"}`);
  if (s > 0 || m === 0) parts.push(`${s} ${s === 1 ? "second" : "seconds"}`);
  return parts.join(" ");
}
