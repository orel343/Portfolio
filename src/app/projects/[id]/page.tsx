import { getProject } from '@/app/lib/projects';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Github, LinkIcon } from 'lucide-react';
import { LikeButton } from '@/app/components/like-button';
import { ViewCounter } from '@/app/components/view-counter';
import { format } from 'date-fns';

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProject(params.id);

  if (!project) {
    notFound();
  }

  const formatDate = (date: number | null) => {
    if (!date) return null;
    return format(new Date(date), 'MMMM d, yyyy');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[400px] w-full">
        <Image
          src={project.imageUrl || '/placeholder.png'}
          alt={`Cover image for ${project.title}`}
          fill
          className="object-cover"
          priority
        />
        {project.status && (
          <Badge 
            className={`absolute top-4 right-4 ${getStatusColor(project.status)}`}
            variant="secondary"
          >
            {project.status}
          </Badge>
        )}
      </div>

      <div className="container max-w-7xl px-6 py-8">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {project.title}
        </h1>

        <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Written on {formatDate(project.createdAt)}
          </div>
          {project.startDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Last updated on {formatDate(project.startDate)}
            </div>
          )}
          <div className="flex items-center gap-4">
            <ViewCounter projectId={project.id} initialViews={project.views} />
          </div>
          <div className="flex gap-2">
            {project.githubUrl && (
              <Button asChild variant="outline" size="sm">
                <Link href={project.githubUrl}>
                  <Github className="mr-2 h-4 w-4" />
                  Repository
                </Link>
              </Button>
            )}
            {project.liveUrl && (
              <Button asChild size="sm">
                <Link href={project.liveUrl}>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Open Live Site
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>

            {project.technologies?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">The Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {project.features && project.features.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Features</h2>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  {project.features.map((feature, index) => (
                    <li key={index} className="leading-relaxed">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-4 pt-4">
              <LikeButton projectId={project.id} initialLikes={project.likes} />
            </div>
          </div>

          <div className="lg:w-64 space-y-6">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-semibold mb-3">Table of Contents</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#overview" className="text-muted-foreground hover:text-foreground">
                    Overview
                  </Link>
                </li>
                {project.technologies?.length > 0 && (
                  <li>
                    <Link href="#tech-stack" className="text-muted-foreground hover:text-foreground">
                      The Tech Stack
                    </Link>
                  </li>
                )}
                {project.features?.length > 0 && (
                  <li>
                    <Link href="#features" className="text-muted-foreground hover:text-foreground">
                      Features
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-green-500/10 text-green-500';
    case 'in-progress':
      return 'bg-blue-500/10 text-blue-500';
    case 'planned':
      return 'bg-orange-500/10 text-orange-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const project = await getProject(params.id);
  return {
    title: project ? project.title : 'Project Not Found',
    description: project ? project.description : 'Project details not available',
  };
}

