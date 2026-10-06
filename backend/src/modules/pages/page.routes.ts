import { Router } from 'express';
import { pageController } from './page.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireRole } from '../../middleware/role.middleware.js';

const router = Router();

// ==========================================
// Public routes (No authentication required)
// Strictly only published page content
// ==========================================
router.get('/public/:slug', (req, res, next) =>
  pageController.getPublicPage(req, res, next)
);

// ==========================================
// Protected CMS routes (Requires authentication)
// ==========================================
router.use(authenticate);

// View all pages (Admin & Editor)
router.get('/', (req, res, next) =>
  pageController.getAllPages(req, res, next)
);

// Create new page (Admin & Editor)
router.post('/', (req, res, next) =>
  pageController.createPage(req, res, next)
);

// View specific page (Admin & Editor)
router.get('/:slug', (req, res, next) =>
  pageController.getPageBySlug(req, res, next)
);

// Edit/Save draft (Admin & Editor)
router.put('/:slug', (req, res, next) =>
  pageController.updatePage(req, res, next)
);

// Delete page (Admin only)
router.delete('/:slug', requireRole('admin'), (req, res, next) =>
  pageController.deletePage(req, res, next)
);

// Publish page (Strictly Admin only)
router.patch('/:slug/publish', requireRole('admin'), (req, res, next) =>
  pageController.publishPage(req, res, next)
);

// Unpublish page (Strictly Admin only)
router.patch('/:slug/unpublish', requireRole('admin'), (req, res, next) =>
  pageController.unpublishPage(req, res, next)
);

export default router;
