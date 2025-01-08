'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Eye, Github, Heart, LinkIcon, Calendar, Clock, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Project } from '@/app/types';
import { incrementProjectViews, likeProject, deleteProject } from '@/app/lib/projects';
import { useAuth } from '@/app/contexts/auth-context';
import { useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [likes, setLikes] = useState(project.likes || 0);
  const [views, setViews] = useState(project.views || 0);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLike = async () => {
    if (!user) return;
    const newLikes = await likeProject(project.id);
    setLikes(newLikes);
  };

  const handleView = async () => {
    const newViews = await incrementProjectViews(project.id);
    setViews(newViews);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteProject(project.id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: Project['status']) => {
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
  };

  const formatDate = (date: number | null) => {
    if (!date) return null;
    return format(new Date(date), 'MM/dd/yy');
  };

  return (
    <Card className="overflow-hidden">
      <Link href={`/projects/${project.id}`} onClick={handleView}>
        <CardContent className="p-0">
          <div className="relative aspect-video">
            <Image
              src={project.imageUrl || '/placeholder.png'}
              alt={project.title || 'Project image'}
              fill
              className="object-cover"
            />
            {project.status && (
              <Badge 
                className={`absolute top-2 right-2 ${getStatusColor(project.status)}`}
                variant="secondary"
              >
                {project.status}
              </Badge>
            )}
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold">{project.title}</h3>
              {project.category && <Badge variant="outline">{project.category}</Badge>}
            </div>
            <p className="text-muted-foreground">{project.description}</p>
            {project.startDate && (
              <div className="flex items-center mt-2">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(project.startDate)}
              </div>
            )}
            {project.endDate && (
              <div className="flex items-center mt-1">
                <Clock className="w-4 h-4 mr-1" />
                {formatDate(project.endDate)}
              </div>
            )}
            {project.technologies && project.technologies.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="bg-primary/10 text-primary"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="flex justify-between p-6 border-t">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            disabled={!user}
          >
            <Heart className="h-4 w-4" />
            <span className="ml-2">{likes}</span>
          </Button>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{views}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {project.liveUrl && (
            <Button asChild size="icon" variant="ghost">
              <Link href={project.liveUrl}>
                <LinkIcon className="h-4 w-4" />
              </Link>
            </Button>
          )}
          {project.githubUrl && (
            <Button asChild size="icon" variant="ghost">
              <Link href={project.githubUrl}>
                <Github className="h-4 w-4" />
              </Link>
            </Button>
          )}
          {isAdmin && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={(e) => e.preventDefault()}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the project.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

