import { Fragment } from "react";
import { Tag } from "@/components/ui/Tag";
import { content } from "@/content";
import { SectionHeading } from "./SectionHeading";

export function Stack() {
  const copy = content.sections.stack;
  const titles = new Map(content.projects.map((p) => [p.id, p.title]));

  return (
    <section id="stack" aria-labelledby="stack-title" className="py-section">
      <div className="wrap">
        <SectionHeading id="stack-title" title={copy.title} lede={copy.lede} />
        <dl className="mt-14 border-b border-line">
          {content.stack.map((group) => (
            <div
              key={group.title}
              className="grid gap-x-14 gap-y-1.5 border-t border-line py-5 phone:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]"
            >
              <dt className="font-medium text-ink">{group.title}</dt>
              <dd className="text-ink-2">
                {group.items.map((item, i) => (
                  <Fragment key={item.name}>
                    {i > 0 && ", "}
                    {item.name}
                    {item.tag && <Tag>{item.tag}</Tag>}
                  </Fragment>
                ))}
                {group.usedIn.length > 0 && (
                  <span className="mt-1.5 block text-sm text-ink-3">
                    {copy.usedIn}{" "}
                    {group.usedIn.map((id, i) => (
                      <Fragment key={id}>
                        {i > 0 && ", "}
                        <a
                          href={`#${id}`}
                          className="text-ink-2 underline decoration-line-2 decoration-1 underline-offset-4 transition-[text-decoration-color,color] duration-200 hover:text-ink hover:decoration-ink"
                        >
                          {titles.get(id)}
                        </a>
                      </Fragment>
                    ))}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
