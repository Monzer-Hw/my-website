import { cacheLife } from "next/cache";
import { site } from "@/content/site";

// cacheComponents forbids new Date() in the prerendered shell, so the year is
// cached; "max" refreshes it at most every 30 days instead of every 15 minutes.
async function CopyrightYear() {
  "use cache";
  cacheLife("max");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  return (
    <footer className="border-t border-line pt-6 pb-8 text-ink-3">
      <div className="wrap flex flex-wrap justify-between gap-x-8 gap-y-3 text-sm">
        <p>
          © <CopyrightYear /> {site.name}
        </p>
        <nav aria-label="Legal">
          <ul className="flex list-none gap-5">
            {site.legal.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="no-underline transition-colors duration-200 hover:text-ink">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
