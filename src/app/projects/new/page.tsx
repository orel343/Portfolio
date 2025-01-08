'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/app/contexts/auth-context';
import { addProject } from '@/app/lib/projects';
import { uploadImage } from '@/app/lib/storage';
import { ImagePlus, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function NewProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [currentTech, setCurrentTech] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'planned' | 'in-progress' | 'completed'>('planned');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [currentFeature, setCurrentFeature] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAddTechnology = () => {
    if (currentTech.trim() && !technologies.includes(currentTech.trim())) {
      setTechnologies([...technologies, currentTech.trim()]);
      setCurrentTech('');
    }
  };

  const handleRemoveTechnology = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech));
  };

  const handleAddFeature = () => {
    if (currentFeature.trim() && !features.includes(currentFeature.trim())) {
      setFeatures([...features, currentFeature.trim()]);
      setCurrentFeature('');
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setFeatures(features.filter(f => f !== feature));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin || !image) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload image to Firebase Storage
      const imageUrl = await uploadImage(image, `projects/${Date.now()}-${image.name}`);

      // Create project with unique ID
      const projectData = {
        title,
        description,
        imageUrl,
        liveUrl,
        githubUrl,
        technologies,
        category,
        status,
        startDate: new Date(startDate).getTime(),
        ...(endDate && { endDate: new Date(endDate).getTime() }),
        features,
        views: 0,
        likes: 0,
        createdAt: Date.now(),
      };

      await addProject(projectData);
      
      toast({
        title: "Success",
        description: "Your project has been created.",
      });
      router.push('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!isAdmin) {
    return <div className="container py-12">You do not have permission to view this page.</div>;
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Create New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Project Image
          </label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Select Image
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
              required
            />
            {image && <span className="text-sm text-muted-foreground">{image.name}</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Technologies
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={currentTech}
              onChange={(e) => setCurrentTech(e.target.value)}
              placeholder="Add technology..."
            />
            <Button type="button" onClick={handleAddTechnology}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="bg-primary/10 text-primary"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleRemoveTechnology(tech)}
                  className="ml-2"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Category
          </label>
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Web Development, Mobile App"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Status
          </label>
          <Select onValueChange={(value: 'planned' | 'in-progress' | 'completed') => setStatus(value)} defaultValue={status}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Start Date
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              End Date
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Features
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={currentFeature}
              onChange={(e) => setCurrentFeature(e.target.value)}
              placeholder="Add feature..."
            />
            <Button type="button" onClick={handleAddFeature}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {features.map((feature) => (
              <Badge
                key={feature}
                variant="secondary"
                className="bg-primary/10 text-primary"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(feature)}
                  className="ml-2"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="liveUrl" className="block text-sm font-medium mb-1">
            Live URL
          </label>
          <Input
            id="liveUrl"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="githubUrl" className="block text-sm font-medium mb-1">
            GitHub URL
          </label>
          <Input
            id="githubUrl"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={isUploading}>
          {isUploading ? 'Creating...' : 'Create Project'}
        </Button>
      </form>
    </div>
  );
}

