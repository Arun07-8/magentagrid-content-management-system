export interface Article {
  id: string
  title: string
  excerpt: string
  category: 'Technology' | 'Lifestyle' | 'Business' | 'Design'
  date: string
  readTime?: string
  imageUrl: string
}

export const ARTICLES: Article[] = [
  {
    id: 'future-of-web-dev-2025',
    title: 'The Future of Web Development in 2025',
    excerpt: 'Explore the latest trends and technologies shaping the future of web development.',
    category: 'Technology',
    date: 'Apr 22, 2025',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'build-better-habits',
    title: 'How to Build Better Habits',
    excerpt: 'Small changes can make a big difference. Here\'s how to build better daily habits.',
    category: 'Lifestyle',
    date: 'Apr 18, 2025',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'content-marketing-still-works',
    title: 'Why Content Marketing Still Works',
    excerpt: 'Quality content builds trust, attracts audience and drives long-term success.',
    category: 'Business',
    date: 'Apr 15, 2025',
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'simple-design-tips',
    title: 'Simple Design Tips for Better UI',
    excerpt: 'Practical and effective design patterns to elevate your user interfaces today.',
    category: 'Design',
    date: 'Apr 12, 2025',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'nextjs-15-whats-new',
    title: "Next.js 15: What's New?",
    excerpt: 'A comprehensive deep dive into features, performance boosts, and developer experience in Next.js 15.',
    category: 'Technology',
    date: 'Apr 10, 2025',
    readTime: '7 min read',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'work-life-balance-tips',
    title: 'Work-Life Balance Tips',
    excerpt: 'Actionable strategies for remote professionals to stay productive without burning out.',
    category: 'Lifestyle',
    date: 'Apr 8, 2025',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
  },
]
