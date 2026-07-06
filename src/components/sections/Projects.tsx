import { portfolio } from "../../data/portfolio";
import { SectionHeading, SectionWrapper } from "../ui/SectionWrapper";
import { ProjectCard } from "../ui/ProjectCard";

export function Projects() {
  return (
    <SectionWrapper id="projects" className="grid-pattern" ariaLabelledBy="projects-heading">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="projects-heading"
          eyebrow="Work"
          title="Selected"
          highlight="projects"
        />

        <div className="grid gap-8 md:grid-cols-2">
          {portfolio.projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
