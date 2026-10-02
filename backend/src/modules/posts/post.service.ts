import mongoose from 'mongoose';
import { Post, IPost, PostStatus } from './post.model.js';
import { CreatePostInput, UpdatePostInput } from './post.validation.js';
import { AppError } from '../../middleware/error.middleware.js';
import { broadcastEvent } from '../../config/socket.js';
import logger from '../../utils/logger.js';

interface InMemoryPost {
  _id: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category: string;
  status: PostStatus;
  author: {
    id: string;
    name: string;
  };
  views: number;
  readTime: string;
  createdAt: Date;
  updatedAt: Date;
}

const INITIAL_POSTS: InMemoryPost[] = [
  {
    _id: '662b2e8a1d5a8b001f3e2001',
    title: 'Better Ways to Build a Website',
    description: 'Learn the best practices to build modern websites using React, TypeScript and more.',
    content: `Building a modern website is easier than ever with the right tools and technologies. In this post, we'll explore the best practices, tools and tips for building a fast, scalable and user-friendly website.

From modular component design to optimized assets and accessible color hierarchies, crafting high-performance user interfaces requires attention to both aesthetic details and engineering principles.`,
    status: 'Published',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    author: { id: '662b2e8a1d5a8b001f3e1a01', name: 'CMS Administrator' },
    views: 420,
    readTime: '5 min read',
    createdAt: new Date('2025-04-28T10:00:00.000Z'),
    updatedAt: new Date('2025-04-28T10:00:00.000Z'),
  },
  {
    _id: '662b2e8a1d5a8b001f3e2002',
    title: 'React 19 New Features',
    description: 'Everything you need to know about the latest React 19 release and architectural changes.',
    content: `React 19 introduces major enhancements including the React Compiler, Actions, and improved server components. These updates significantly streamline the developer experience and deliver better runtime performance.

Understanding concurrent rendering and automatic memoization will unlock substantial gains across both mobile and desktop client applications.`,
    status: 'Published',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    author: { id: '662b2e8a1d5a8b001f3e1a01', name: 'CMS Administrator' },
    views: 350,
    readTime: '4 min read',
    createdAt: new Date('2025-04-26T14:30:00.000Z'),
    updatedAt: new Date('2025-04-26T14:30:00.000Z'),
  },
  {
    _id: '662b2e8a1d5a8b001f3e2003',
    title: 'The Future of Web Development in 2025',
    description: 'Explore the latest trends and technologies shaping the future of web development.',
    content: `Web development is evolving faster than ever. In 2025, we can expect new tools, frameworks and practices that will make the web more powerful, accessible and intelligent.

1. The Rise of AI-Powered Development
Artificial intelligence is not just a buzzword anymore. In 2025, AI tools will help developers write, debug and optimize code faster than ever before.

2. Better Performance & Core Web Vitals
Performance will continue to be a major focus. Frameworks like Next.js, React and Vite are optimizing runtime bundles for sub-second page loads.`,
    status: 'Published',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    author: { id: '662b2e8a1d5a8b001f3e1a01', name: 'CMS Administrator' },
    views: 512,
    readTime: '6 min read',
    createdAt: new Date('2025-04-22T09:15:00.000Z'),
    updatedAt: new Date('2025-04-22T09:15:00.000Z'),
  },
  {
    _id: '662b2e8a1d5a8b001f3e2004',
    title: 'Modern UI/UX Trends and Best Practices',
    description: 'Exploring clean aesthetics, micro-interactions, and accessible interface designs.',
    content: `Designing for the modern user requires balancing visual minimalism with expressive typography and accessible color contrasts. Great design is not just how it looks, but how effortlessly it works.

Every interaction should provide intuitive visual feedback, seamless state transitions, and responsive layout shifts.`,
    status: 'Published',
    category: 'Design',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    author: { id: '662b2e8a1d5a8b001f3e1a01', name: 'CMS Administrator' },
    views: 290,
    readTime: '3 min read',
    createdAt: new Date('2025-04-20T11:45:00.000Z'),
    updatedAt: new Date('2025-04-20T11:45:00.000Z'),
  },
  {
    _id: '662b2e8a1d5a8b001f3e2005',
    title: 'Getting Started with TypeScript',
    description: 'A beginner-friendly guide to typing your React applications confidently.',
    content: `TypeScript provides robust static typing, autocomplete superpowers, and compile-time safeguards. Setting up strict typing early in your codebase prevents costly runtime errors down the road.`,
    status: 'Draft',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    author: { id: '662b2e8a1d5a8b001f3e1a01', name: 'CMS Administrator' },
    views: 0,
    readTime: '4 min read',
    createdAt: new Date('2025-04-18T16:20:00.000Z'),
    updatedAt: new Date('2025-04-18T16:20:00.000Z'),
  },
];

let inMemoryPosts: InMemoryPost[] = [...INITIAL_POSTS];

export class PostService {
  private isDbConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  private calculateReadTime(content: string): string {
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${minutes} min read`;
  }

  /**
   * Get all published posts for the public website
   */
  async getPublicPosts(filter: { search?: string; category?: string } = {}): Promise<any[]> {
    if (this.isDbConnected()) {
      const query: any = { status: 'Published' };

      if (filter.category && filter.category !== 'All') {
        query.category = filter.category;
      }

      if (filter.search && filter.search.trim()) {
        const searchRegex = new RegExp(filter.search.trim(), 'i');
        query.$or = [{ title: searchRegex }, { description: searchRegex }, { content: searchRegex }];
      }

      return Post.find(query).sort({ createdAt: -1 });
    } else {
      let filtered = inMemoryPosts.filter((p) => p.status === 'Published');

      if (filter.category && filter.category !== 'All') {
        filtered = filtered.filter((p) => p.category.toLowerCase() === filter.category!.toLowerCase());
      }

      if (filter.search && filter.search.trim()) {
        const q = filter.search.trim().toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.content.toLowerCase().includes(q)
        );
      }

      return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  }

  /**
   * Get a single published post by ID for public view
   */
  async getPublicPostById(id: string): Promise<any> {
    if (this.isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid post ID', 400);
      }

      const post = await Post.findOne({ _id: id, status: 'Published' });
      if (!post) {
        throw new AppError('Post not found or is not published', 404);
      }

      post.views = (post.views || 0) + 1;
      await post.save();
      return post;
    } else {
      const post = inMemoryPosts.find((p) => p._id === id && p.status === 'Published');
      if (!post) {
        throw new AppError('Post not found or is not published', 404);
      }
      post.views += 1;
      return post;
    }
  }

  /**
   * Get all posts for CMS dashboard/list (Drafts + Published)
   */
  async getAllPosts(filter: { search?: string; status?: string } = {}): Promise<any[]> {
    if (this.isDbConnected()) {
      const query: any = {};

      if (filter.status && ['Draft', 'Published'].includes(filter.status)) {
        query.status = filter.status;
      }

      if (filter.search && filter.search.trim()) {
        const searchRegex = new RegExp(filter.search.trim(), 'i');
        query.$or = [{ title: searchRegex }, { description: searchRegex }];
      }

      return Post.find(query).sort({ updatedAt: -1 });
    } else {
      let filtered = [...inMemoryPosts];

      if (filter.status && ['Draft', 'Published'].includes(filter.status)) {
        filtered = filtered.filter((p) => p.status === filter.status);
      }

      if (filter.search && filter.search.trim()) {
        const q = filter.search.trim().toLowerCase();
        filtered = filtered.filter(
          (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
        );
      }

      return filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }
  }

  /**
   * Get single post by ID for CMS (Draft or Published)
   */
  async getPostById(id: string): Promise<any> {
    if (this.isDbConnected()) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError('Invalid post ID', 400);
      }

      const post = await Post.findById(id);
      if (!post) {
        throw new AppError('Post not found', 404);
      }
      return post;
    } else {
      const post = inMemoryPosts.find((p) => p._id === id);
      if (!post) {
        throw new AppError('Post not found', 404);
      }
      return post;
    }
  }

  /**
   * Create a new post
   */
  async createPost(
    data: CreatePostInput,
    author: { id: string; name: string },
    userRole: string
  ): Promise<any> {
    // Role check: Editor cannot publish directly
    let finalStatus: PostStatus = data.status || 'Draft';
    if (userRole === 'editor' && finalStatus === 'Published') {
      throw new AppError('Editors do not have permission to publish posts directly. Must be saved as Draft.', 403);
    }

    if (this.isDbConnected()) {
      const post = await Post.create({
        ...data,
        status: finalStatus,
        author: {
          id: new mongoose.Types.ObjectId(author.id),
          name: author.name,
        },
      });

      broadcastEvent('posts:changed', { action: 'create', post });
      return post;
    } else {
      const now = new Date();
      const newPost: InMemoryPost = {
        _id: new mongoose.Types.ObjectId().toString(),
        title: data.title,
        description: data.description,
        content: data.content,
        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        category: data.category || 'Technology',
        status: finalStatus,
        author,
        views: 0,
        readTime: this.calculateReadTime(data.content),
        createdAt: now,
        updatedAt: now,
      };

      inMemoryPosts.unshift(newPost);
      broadcastEvent('posts:changed', { action: 'create', post: newPost });
      return newPost;
    }
  }

  /**
   * Update an existing post
   */
  async updatePost(id: string, data: UpdatePostInput, userRole: string): Promise<any> {
    if (this.isDbConnected()) {
      const post = await this.getPostById(id);

      if (data.status === 'Published' && post.status !== 'Published' && userRole === 'editor') {
        throw new AppError('Editors do not have permission to publish posts.', 403);
      }

      Object.assign(post, data);
      await post.save();

      broadcastEvent('posts:changed', { action: 'update', post });
      return post;
    } else {
      const index = inMemoryPosts.findIndex((p) => p._id === id);
      if (index === -1) {
        throw new AppError('Post not found', 404);
      }

      const post = inMemoryPosts[index];

      if (data.status === 'Published' && post.status !== 'Published' && userRole === 'editor') {
        throw new AppError('Editors do not have permission to publish posts.', 403);
      }

      const updated = {
        ...post,
        ...data,
        updatedAt: new Date(),
        readTime: data.content ? this.calculateReadTime(data.content) : post.readTime,
      };

      inMemoryPosts[index] = updated;
      broadcastEvent('posts:changed', { action: 'update', post: updated });
      return updated;
    }
  }

  /**
   * Publish a post (Admin only)
   */
  async publishPost(id: string): Promise<any> {
    if (this.isDbConnected()) {
      const post = await this.getPostById(id);
      post.status = 'Published';
      await post.save();

      broadcastEvent('posts:changed', { action: 'publish', post });
      return post;
    } else {
      const index = inMemoryPosts.findIndex((p) => p._id === id);
      if (index === -1) throw new AppError('Post not found', 404);

      inMemoryPosts[index].status = 'Published';
      inMemoryPosts[index].updatedAt = new Date();

      broadcastEvent('posts:changed', { action: 'publish', post: inMemoryPosts[index] });
      return inMemoryPosts[index];
    }
  }

  /**
   * Unpublish a post (Admin only)
   */
  async unpublishPost(id: string): Promise<any> {
    if (this.isDbConnected()) {
      const post = await this.getPostById(id);
      post.status = 'Draft';
      await post.save();

      broadcastEvent('posts:changed', { action: 'unpublish', post });
      return post;
    } else {
      const index = inMemoryPosts.findIndex((p) => p._id === id);
      if (index === -1) throw new AppError('Post not found', 404);

      inMemoryPosts[index].status = 'Draft';
      inMemoryPosts[index].updatedAt = new Date();

      broadcastEvent('posts:changed', { action: 'unpublish', post: inMemoryPosts[index] });
      return inMemoryPosts[index];
    }
  }

  /**
   * Delete a post (Admin only)
   */
  async deletePost(id: string): Promise<void> {
    if (this.isDbConnected()) {
      const post = await this.getPostById(id);
      await Post.findByIdAndDelete(post._id);

      broadcastEvent('posts:changed', { action: 'delete', id });
    } else {
      const index = inMemoryPosts.findIndex((p) => p._id === id);
      if (index === -1) throw new AppError('Post not found', 404);

      inMemoryPosts.splice(index, 1);
      broadcastEvent('posts:changed', { action: 'delete', id });
    }
  }

  /**
   * Seed default posts if collection is empty
   */
  async seedInitialPosts(): Promise<void> {
    if (!this.isDbConnected()) return;

    const count = await Post.countDocuments();
    if (count > 0) return;

    const docs = INITIAL_POSTS.map((p) => ({
      title: p.title,
      description: p.description,
      content: p.content,
      status: p.status,
      category: p.category,
      imageUrl: p.imageUrl,
      views: p.views,
      readTime: p.readTime,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    await Post.insertMany(docs);
    logger.info(`Seeded ${docs.length} initial posts in MongoDB`);
  }
}

export const postService = new PostService();
