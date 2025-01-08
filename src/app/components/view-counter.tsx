'use client';

import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { incrementProjectViews } from '@/app/lib/projects';

export function ViewCounter({ projectId, initialViews }: { projectId: string, initialViews: number }) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    const incrementViews = async () => {
      const newViews = await incrementProjectViews(projectId);
      setViews(newViews);
    };
    incrementViews();
  }, [projectId]);

  return (
    <div className="flex items-center text-sm text-muted-foreground">
      <Eye className="mr-2 h-4 w-4" />
      {views} {views === 1 ? 'View' : 'Views'}
    </div>
  );
}

