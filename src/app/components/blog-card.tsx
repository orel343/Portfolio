'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Eye, Heart, ImageOff, Trash2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import type { BlogPost, BlogPostContent } from '@/app/types';
import { incrementBlogViews, likeBlogPost, deleteBlogPost } from '@/app/lib/blog';
import { useAuth } from '@/app/contexts/auth-context';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [likes, setLikes] = useState(post.likes);
  const [views, setViews] = useState(post.views);
  const [likeProgress, setLikeProgress] = useState(post.likeProgress);
  const [imageError, setImageError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    
    const newProgress = [...likeProgress];
    if (newProgress.length >= 3) {
      const newLikes = await likeBlogPost(post.id);
      setLikes(newLikes);
      setLikeProgress([]);
    } else {
      newProgress.push(1);
      setLikeProgress(newProgress);
    }
  };

  const handleView = async () => {
    const newViews = await incrementBlogViews(post.id);
    setViews(newViews);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteBlogPost(post.id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete blog post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderExcerpt = (content: BlogPostContent[] | string) => {
    if (typeof content === 'string') {
      return content.slice(0, 150) + '...';
    }
    
    const firstParagraph = content.find(item => item.type === 'paragraph');
    if (firstParagraph) {
      return firstParagraph.content.slice(0, 150) + '...';
    }
    
    return 'No excerpt available';
  };

  return (
    <Card className="overflow-hidden">
      <Link href={`/blog/${post.id}`} onClick={handleView}>
        <CardContent className="p-0">
          <div className="relative aspect-video">
            {!imageError ? (
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={handleImageError}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200">
                <ImageOff className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold">{post.title}</h3>
            <p className="mt-2 line-clamp-3 text-muted-foreground">
              {renderExcerpt(post.content)}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              disabled={!user}
            >
              <Heart
                className={`h-4 w-4 ${
                  likeProgress.length > 0 ? 'fill-primary text-primary' : ''
                }`}
              />
              <span className="ml-2">{likes}</span>
            </Button>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{views}</span>
            </div>
          </div>
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
                    This action cannot be undone. This will permanently delete the blog post.
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
        </CardFooter>
      </Link>
    </Card>
  );
}

