import { ProjectCard } from '@/app/components/project-card';
import { getProjects } from '@/app/lib/projects';
import { NewProjectButton } from '@/app/components/new-project-button';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="container py-12 blog_bg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-2 text-muted-foreground">
            A showcase of my projects on the web development.
          </p>
        </div>
        <NewProjectButton />
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

