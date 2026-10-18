import { content } from "@/content";

// The home page sections arrive in phase 4; this proves the content wiring.
export default function Home() {
  return (
    <div className="wrap py-section">
      <h1 className="text-4xl font-semibold tracking-tight">{content.site.name}</h1>
      <p className="mt-4 max-w-[30ch]">{content.profile.intro}</p>
    </div>
  );
}
