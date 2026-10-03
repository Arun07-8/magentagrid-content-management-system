import mongoose from 'mongoose';
import { Post, IPost, PostStatus } from './post.model.js';
import { CreatePostInput, UpdatePostInput } from './post.validation.js';
import { AppError } from '../../middleware/error.middleware.js';
import { broadcastEvent } from '../../config/socket.js';

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
  async getPublicPosts(filter: { search?: string } = {}): Promise<any[]> {
    const query: any = { status: 'Published' };
    if (filter.search && filter.search.trim()) {
      const searchRegex = new RegExp(filter.search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }, { content: searchRegex }];
    }

    return Post.find(query).sort({ createdAt: -1 });
  }

  /**
   * Get a single published post by ID for public view
   */
  async getPublicPostById(id: string): Promise<any> {
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
  }

  /**
   * Get all posts for CMS list (Drafts + Published)
   */
  async getAllPosts(filter: { search?: string; status?: string } = {}): Promise<any[]> {
    const query: any = {};

    if (filter.status && ['Draft', 'Published'].includes(filter.status)) {
      query.status = filter.status;
    }

    if (filter.search && filter.search.trim()) {
      const searchRegex = new RegExp(filter.search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    return Post.find(query).sort({ updatedAt: -1 });
  }

  /**
   * Get single post by ID for CMS (Draft or Published)
   */
  async getPostById(id: string): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid post ID', 400);
    }

    const post = await Post.findById(id);
    if (!post) {
      throw new AppError('Post not found', 404);
    }
    return post;
  }

  /**
   * Create a new post
   */
  async createPost(
    data: CreatePostInput,
    author: { id: string; name: string },
    userRole: string
  ): Promise<any> {
    let finalStatus: PostStatus = data.status || 'Draft';
    if (userRole === 'editor' && finalStatus === 'Published') {
      throw new AppError('Editors do not have permission to publish posts directly. Must be saved as Draft.', 403);
    }

    const authorId = mongoose.Types.ObjectId.isValid(author.id)
      ? new mongoose.Types.ObjectId(author.id)
      : new mongoose.Types.ObjectId();

    const post = await Post.create({
      ...data,
      status: finalStatus,
      readTime: this.calculateReadTime(data.content),
      author: {
        id: authorId,
        name: author.name,
      },
    });

    broadcastEvent('posts:changed', { action: 'create', post });
    return post;
  }

  /**
   * Update an existing post
   */
  async updatePost(id: string, data: UpdatePostInput, userRole: string): Promise<any> {
    const post = await this.getPostById(id);

    if (data.status === 'Published' && post.status !== 'Published' && userRole === 'editor') {
      throw new AppError('Editors do not have permission to publish posts.', 403);
    }

    const updateFields = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );
    Object.assign(post, updateFields);
    if (data.content) {
      post.readTime = this.calculateReadTime(data.content);
    }
    await post.save();

    broadcastEvent('posts:changed', { action: 'update', post });
    return post;
  }

  /**
   * Publish a post (Admin only)
   */
  async publishPost(id: string): Promise<any> {
    const post = await this.getPostById(id);
    post.status = 'Published';
    await post.save();

    broadcastEvent('posts:changed', { action: 'publish', post });
    return post;
  }

  /**
   * Unpublish a post (Admin only)
   */
  async unpublishPost(id: string): Promise<any> {
    const post = await this.getPostById(id);
    post.status = 'Draft';
    await post.save();

    broadcastEvent('posts:changed', { action: 'unpublish', post });
    return post;
  }

  /**
   * Delete a post (Admin only)
   */
  async deletePost(id: string): Promise<void> {
    const post = await this.getPostById(id);
    await Post.findByIdAndDelete(post._id);

    broadcastEvent('posts:changed', { action: 'delete', id });
  }
}

export const postService = new PostService();
