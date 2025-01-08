'use client';

import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/auth-context';

export function NewBlogButton() {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <Button asChild>
      <Link href="/blog/new">
        <PlusCircle className="mr-2 h-4 w-4" />
        New Blog Post
      </Link>
    </Button>
  );
}

