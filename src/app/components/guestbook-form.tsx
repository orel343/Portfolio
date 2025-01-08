'use client';

import { useState } from 'react';
import { useAuth } from '@/app/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { addFeedback } from '@/app/lib/feedback';
import { useToast } from '@/hooks/use-toast';

export function GuestbookForm() {
  const { user, signInWithGoogle } = useAuth();
  const [content, setContent] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addFeedback({
        userId: user.id,
        content,
        rating: 5,
        createdAt: Date.now(),
      });
      setContent('');
      toast({
        title: 'Success',
        description: 'Your message has been added to the guestbook.',
      });
    } catch (error) {
      console.error('Error adding feedback:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Your message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      {user ? (
        <Button type="submit">Sign</Button>
      ) : (
        <Button type="button" onClick={() => signInWithGoogle()}>
          Sign in to leave a message
        </Button>
      )}
    </form>
  );
}

