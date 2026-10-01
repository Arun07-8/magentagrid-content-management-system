import { Router } from 'express';
import { postController } from './post.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';
import { validateRequest } from '../../middleware/validate.middleware.js';
import { createPostSchema, updatePostSchema } from './post.validation.js';

const router = Router();

// ==========================================
// Public routes (No authentication required)
// Only published posts are returned
// ==========================================
router.get('/public', (req, res, next) => postController.getPublicPosts(req, res, next));
router.get('/public/:id', (req, res, next) => postController.getPublicPostById(req, res, next));

// ==========================================
// CMS / Protected routes (Requires Auth)
// ==========================================
router.use(authenticate);

// View posts (Admin & Editor)
router.get('/', (req, res, next) => postController.getAllPosts(req, res, next));
router.get('/:id', (req, res, next) => postController.getPostById(req, res, next));

// Create post (Admin & Editor)
router.post('/', validateRequest(createPostSchema), (req, res, next) =>
  postController.createPost(req, res, next)
);

// Edit post (Admin & Editor)
router.put('/:id', validateRequest(updatePostSchema), (req, res, next) =>
  postController.updatePost(req, res, next)
);

// Publish post (Admin ONLY)
router.patch('/:id/publish', requireRole('admin'), (req, res, next) =>
  postController.publishPost(req, res, next)
);

// Unpublish post (Admin ONLY)
router.patch('/:id/unpublish', requireRole('admin'), (req, res, next) =>
  postController.unpublishPost(req, res, next)
);

// Delete post (Admin ONLY)
router.delete('/:id', requireRole('admin'), (req, res, next) =>
  postController.deletePost(req, res, next)
);

export default router;
