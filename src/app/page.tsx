import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Github, Linkedin, FileText } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-12 sm:py-16">
      <div className="container flex flex-col items-center text-center">
        <h1 className="animate-fade-up text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
          Hi!
          <br />
          I&apos;m <span className="text-primary">Orel</span> - Full Stack Developer
        </h1>
        <p className="mt-4 max-w-[42rem] animate-fade-up text-muted-foreground sm:text-xl">
          I&apos;m a self-taught developer, who&apos;s currently pursuing a Full-Stack development to create
          stunning user experiences on the front-end, scalable, and secure infrastructure on the
          backend.
        </p>
        <div className="mt-8 flex animate-fade-up items-center gap-4">
          <Button asChild>
            <Link href="/blog">Read my blog</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/about">Learn more about me</Link>
          </Button>
        </div>
        <div className="mt-8 flex animate-fade-up items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/resume.pdf">
              <FileText className="h-5 w-5" />
              <span className="sr-only">Resume</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon">
            <Link href="https://linkedin.com">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon">
            <Link href="https://github.com">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

