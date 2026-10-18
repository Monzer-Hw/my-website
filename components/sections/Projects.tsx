import { content } from "@/content";
import { ProjectRow } from "./ProjectRow";
import { SectionHeading } from "./SectionHeading";

export function Projects() {
  const copy = content.sections.projects;
  return (
    <section id="projects" aria-labelledby="projects-title" className="bg-surface py-section">
      <div className="wrap">
        <SectionHeading id="projects-title" title={copy.title} lede={copy.lede} />
        <div className="mt-16 border-b border-line-2">
          {content.projects.map((project) => (
            <ProjectRow key={project.id} project={project} copy={copy} />
          ))}
        </div>
      </div>
    </section>
  );
}
