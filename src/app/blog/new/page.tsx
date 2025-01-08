'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/app/contexts/auth-context';
import { addBlogPost } from '@/app/lib/blog';
import { uploadImage } from '@/app/lib/storage';
import { BlogPostContent } from '@/app/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImagePlus } from 'lucide-react';

export default function NewBlogPost() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [content, setContent] = useState<BlogPostContent[]>([]);
  const [currentContent, setCurrentContent] = useState('');
  const [currentType, setCurrentType] = useState<BlogPostContent['type']>('paragraph');
  const [currentHref, setCurrentHref] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  const handleAddContent = () => {
    if (currentContent.trim()) {
      setContent([...content, { 
        type: currentType, 
        content: currentContent.trim(),
        ...(currentType === 'link' || currentType === 'button' ? { href: currentHref } : {})
      }]);
      setCurrentContent('');
      setCurrentHref('');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin || !image) {
      toast({
        title: "Error",
        description: "You must be an admin and select an image to create a post.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload image to Firebase Storage
      const imageUrl = await uploadImage(image, `blog/${Date.now()}-${image.name}`);

      // Create blog post
      await addBlogPost({
        title,
        content,
        imageUrl,
        authorId: user.id,
        views: 0,
        likes: 0,
        likeProgress: [],
        createdAt: Date.now(),
      });

      toast({
        title: "Success",
        description: "Your blog post has been created.",
      });
      router.push('/blog');
    } catch (error) {
      console.error('Error creating blog post:', error);
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
      <h1 className="text-3xl font-bold mb-6">Create New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
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
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            Cover Image
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
              id="image"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              required
            />
            {image && <span className="text-sm text-muted-foreground">{image.name}</span>}
          </div>
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Content
          </label>
          <div className="flex gap-2 mb-2">
            <Select onValueChange={(value) => setCurrentType(value as BlogPostContent['type'])}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paragraph">Paragraph</SelectItem>
                <SelectItem value="heading1">Heading 1</SelectItem>
                <SelectItem value="heading2">Heading 2</SelectItem>
                <SelectItem value="heading3">Heading 3</SelectItem>
                <SelectItem value="link">Link</SelectItem>
                <SelectItem value="button">Button</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={currentContent}
              onChange={(e) => setCurrentContent(e.target.value)}
              placeholder="Enter content"
            />
            {(currentType === 'link' || currentType === 'button') && (
              <Input
                value={currentHref}
                onChange={(e) => setCurrentHref(e.target.value)}
                placeholder="Enter URL"
              />
            )}
            <Button type="button" onClick={handleAddContent}>Add</Button>
          </div>
          <div className="border p-4 rounded-md min-h-[200px]">
            {content.map((item, index) => (
              <div key={index} className="mb-2">
                {item.type === 'paragraph' && <p>{item.content}</p>}
                {item.type === 'heading1' && <h1 className="text-2xl font-bold">{item.content}</h1>}
                {item.type === 'heading2' && <h2 className="text-xl font-semibold">{item.content}</h2>}
                {item.type === 'heading3' && <h3 className="text-lg font-medium">{item.content}</h3>}
                {item.type === 'link' && <a href={item.href} className="text-blue-500 underline">{item.content}</a>}
                {item.type === 'button' && <button className="bg-blue-500 text-white px-4 py-2 rounded">{item.content}</button>}
              </div>
            ))}
          </div>
        </div>
        <Button type="submit" disabled={isUploading}>
          {isUploading ? 'Creating...' : 'Create Post'}
        </Button>
      </form>
    </div>
  );
}

