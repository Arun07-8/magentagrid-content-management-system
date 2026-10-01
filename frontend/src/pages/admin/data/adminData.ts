export interface AdminPost {
  id: string
  title: string
  description: string
  content: string
  status: 'Published' | 'Draft'
  updatedDate: string
  imageUrl: string
  views?: string
}

export const ADMIN_POSTS: AdminPost[] = [
  {
    id: 'post-1',
    title: 'Better Ways to Build a Website',
    description: 'Learn the best practices to build modern websites using React, TypeScript and more.',
    content:
      "Building a modern website is easier than ever with the right tools and technologies. In this post, we'll explore the best practices, tools and tips for building a fast, scalable and user-friendly website.",
    status: 'Published',
    updatedDate: 'Apr 28, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
    views: '420',
  },
  {
    id: 'post-2',
    title: 'React 19 New Features',
    description: 'Everything you need to know about the latest React 19 release and architectural changes.',
    content:
      'React 19 introduces major enhancements including the React Compiler, Actions, and improved server components. These updates significantly streamline the developer experience and deliver better runtime performance.',
    status: 'Published',
    updatedDate: 'Apr 26, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    views: '350',
  },
  {
    id: 'post-3',
    title: 'The Future of Web Development',
    description: 'Insights into where web technologies are heading over the next five years.',
    content:
      'Web development continues to accelerate with AI integration, edge compute, and progressive hydration models. Developers who embrace these tools early will lead the next generation of web applications.',
    status: 'Draft',
    updatedDate: 'Apr 24, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    views: '0',
  },
  {
    id: 'post-4',
    title: 'Modern UI/UX Trends',
    description: 'Exploring clean aesthetics, micro-interactions, and accessible interface designs.',
    content:
      'Designing for the modern user requires balancing visual minimalism with expressive typography and accessible color contrasts. Great design is not just how it looks, but how effortlessly it works.',
    status: 'Published',
    updatedDate: 'Apr 22, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
    views: '290',
  },
  {
    id: 'post-5',
    title: 'Getting Started with TypeScript',
    description: 'A beginner-friendly guide to typing your React applications confidently.',
    content:
      'TypeScript provides robust static typing, autocomplete superpowers, and compile-time safeguards. Setting up strict typing early in your codebase prevents costly runtime errors down the road.',
    status: 'Draft',
    updatedDate: 'Apr 20, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    views: '0',
  },
]
