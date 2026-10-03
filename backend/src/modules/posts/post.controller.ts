import { Request, Response, NextFunction } from 'express';
import { postService } from './post.service.js';

export class PostController {
  // Public endpoints
  async getPublicPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search } = req.query;
      const posts = await postService.getPublicPosts({
        search: search as string,
      });

      res.status(200).json({
        success: true,
        count: posts.length,
        data: posts,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPublicPostById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await postService.getPublicPostById(req.params.id as string);
      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  // CMS/Admin endpoints
  async getAllPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, status } = req.query;
      const posts = await postService.getAllPosts({
        search: search as string,
        status: status as string,
      });

      res.status(200).json({
        success: true,
        count: posts.length,
        data: posts,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPostById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await postService.getPostById(req.params.id as string);
      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  async createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const author = {
        id: req.user!.id,
        name: req.user!.username,
      };

      const post = await postService.createPost(req.body, author, req.user!.role);

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await postService.updatePost(req.params.id as string, req.body, req.user!.role);

      res.status(200).json({
        success: true,
        message: 'Post updated successfully',
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  async publishPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await postService.publishPost(req.params.id as string);

      res.status(200).json({
        success: true,
        message: 'Post published successfully',
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  async unpublishPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await postService.unpublishPost(req.params.id as string);

      res.status(200).json({
        success: true,
        message: 'Post unpublished (moved to draft) successfully',
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await postService.deletePost(req.params.id as string);

      res.status(200).json({
        success: true,
        message: 'Post deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const postController = new PostController();
