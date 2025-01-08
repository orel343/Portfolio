'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/auth-context';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Heart } from 'lucide-react';
import { incrementBlogViews, likeBlogPost } from '@/app/lib/blog';
import type { BlogPost as BlogPostType, BlogPostContent } from '@/app/types';

interface BlogPostProps {
  post: BlogPostType;
}

export function BlogPost({ post }: BlogPostProps) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes);
  const [views, setViews] = useState(post.views);
  const [likeProgress, setLikeProgress] = useState(post.likeProgress);

  const handleLike = async () => {
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

  useEffect(() => {
    const incrementViews = async () => {
      const newViews = await incrementBlogViews(post.id);
      setViews(newViews);
    };
    incrementViews();
  }, [post.id]);

  const renderContent = (item: BlogPostContent) => {
    switch (item.type) {
      case 'paragraph':
        return <p className="mb-4">{item.content}</p>;
      case 'heading1':
        return <h1 className="text-3xl font-bold mb-4">{item.content}</h1>;
      case 'heading2':
        return <h2 className="text-2xl font-semibold mb-3">{item.content}</h2>;
      case 'heading3':
        return <h3 className="text-xl font-medium mb-2">{item.content}</h3>;
      case 'link':
        return <a href={item.href} className="text-blue-500 underline mb-2 inline-block">{item.content}</a>;
      case 'button':
        return <Button asChild className="mb-4"><Link href={item.href || '#'}>{item.content}</Link></Button>;
      default:
        return null;
    }
  };

  // Format the date using ISO string to ensure consistency
  const formattedDate = new Date(post.createdAt).toISOString().split('T')[0];

  return (
    <div className="container max-w-4xl py-12">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
          <div className="p-6">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="prose max-w-none">
              {Array.isArray(post.content) ? (
                post.content.map((item, index) => (
                  <div key={index}>{renderContent(item)}</div>
                ))
              ) : (
                typeof post.content === 'string' ? <p>{post.content}</p> : null
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-6 bg-muted">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={!user}
            >
              <Heart
                className={`h-4 w-4 mr-2 ${
                  likeProgress.length > 0 ? 'fill-primary text-primary' : ''
                }`}
              />
              <span>{likes}</span>
            </Button>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{views}</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Posted on {formattedDate}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

