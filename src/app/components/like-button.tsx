'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { likeProject } from '@/app/lib/projects';
import { useAuth } from '@/app/contexts/auth-context';

export function LikeButton({ projectId, initialLikes }: { projectId: string, initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);
  const { user } = useAuth();

  const handleLike = async () => {
    if (!user) return;
    const newLikes = await likeProject(projectId);
    setLikes(newLikes);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLike} disabled={!user}>
      <Heart className="mr-2 h-4 w-4" />
      {likes} {likes === 1 ? 'Like' : 'Likes'}
    </Button>
  );
}

