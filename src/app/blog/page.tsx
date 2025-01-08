import { BlogCard } from '@/app/components/blog-card';
import { getBlogPosts } from '@/app/lib/blog';
import { NewBlogButton } from '@/app/components/new-blog-button';

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container py-12 blog_bg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="mt-2 text-muted-foreground">
            Thoughts, ideas, and experiences about web development.
          </p>
        </div>
        <NewBlogButton />
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
