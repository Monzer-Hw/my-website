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
        {/* -ml-3 lines the first link's text up with the page column (links have 12px padding). */}
        <nav aria-label="Main" className="-ml-3 hidden desk:block">
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

        <div className="ml-auto flex items-center gap-2">
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
