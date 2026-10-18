import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/content/site";
import { HeaderShell } from "./HeaderShell";
import { MobileMenu } from "./MobileMenu";
import { SocialLinks } from "./SocialLinks";

export function Header() {
  return (
    <HeaderShell>
      <div className="wrap flex h-header items-center gap-4 desk:gap-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 whitespace-nowrap text-[1.0625rem] font-semibold tracking-[-0.01em] text-ink no-underline"
        >
          <span
            aria-hidden="true"
            className="grid size-[30px] place-items-center rounded-full bg-ink text-[0.6875rem] font-semibold tracking-[0.02em] text-bg"
          >
            {site.initials}
          </span>
          {site.name}
          <span className="sr-only">, home page</span>
        </Link>

        <nav aria-label="Main" className="mx-auto hidden desk:block">
          <ul className="flex list-none gap-0.5">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block px-3 py-2 text-sm text-ink-3 no-underline transition-colors duration-200 hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 desk:ml-0">
          <SocialLinks className="hidden phone:flex" />
          <ButtonLink href={site.cvPath} download variant="soft" size="sm">
            <Icon name="download" />
            Resume
          </ButtonLink>
          <MobileMenu items={site.nav} footer={<SocialLinks variant="bordered" />} />
        </div>
      </div>
    </HeaderShell>
  );
}
