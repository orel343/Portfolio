import { getBlogPost } from '@/app/lib/blog';
import { BlogPost } from '@/app/components/blog-post';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogPost(id);
  
  if (!post) {
    return {
      title: 'Post Not Found'
    };
  }

  return {
    title: post.title,
    description: typeof post.content === 'string' 
      ? post.content.slice(0, 160) 
      : Array.isArray(post.content) 
        ? post.content[0]?.content?.slice(0, 160) || ''
        : ''
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getBlogPost(id);

  if (!post) {
    notFound();
  }

  return <BlogPost post={post} />;
}

