import { IconLink } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";

/** GitHub and LinkedIn icon links; used in the header, mobile menu and contact section. */
export function SocialLinks({
  variant = "plain",
  className,
}: {
  variant?: "plain" | "bordered";
  className?: string;
}) {
  return (
    <ul className={cn("flex list-none", variant === "bordered" ? "gap-2" : "gap-0.5", className)}>
      {site.social.map((s) => (
        <li key={s.network}>
          <IconLink
            icon={s.network}
            label={`${s.label}, ${s.handle} (opens in a new tab)`}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            variant={variant}
          />
        </li>
      ))}
    </ul>
  );
}
