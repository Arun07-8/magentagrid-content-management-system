import { Request, Response, NextFunction } from 'express';
import { PageService } from './page.service.js';

const pageService = new PageService();

export class PageController {
  // Public Endpoint: GET /api/pages/public/:slug
  async getPublicPage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const data = await pageService.getPublicPageBySlug(slug as string);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // CMS/Admin Endpoint: GET /api/pages
  async getAllPages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pages = await pageService.getAllPages();

      res.status(200).json({
        success: true,
        count: pages.length,
        data: pages,
      });
    } catch (error) {
      next(error);
    }
  }

  // CMS/Admin Endpoint: GET /api/pages/:slug
  async getPageBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const page = await pageService.getPageBySlug(slug as string);

      res.status(200).json({
        success: true,
        data: page,
      });
    } catch (error) {
      next(error);
    }
  }

  // CMS/Admin Endpoint: POST /api/pages
  async createPage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, slug, seo, sectionOrder, sections } = req.body;
      const user = req.user ? { id: req.user.id, name: req.user.username } : undefined;

      const newPage = await pageService.createPage(
        { title, slug, seo, sectionOrder, sections },
        user
      );

      res.status(201).json({
        success: true,
        message: 'Page created successfully',
        data: newPage,
      });
    } catch (error) {
      next(error);
    }
  }

  // CMS/Admin Endpoint: PUT /api/pages/:slug
  async updatePage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const { title, newSlug, status, seo, sectionOrder, sections } = req.body;
      const user = req.user ? { id: req.user.id, name: req.user.username } : undefined;

      const updatedPage = await pageService.updatePage(
        slug as string,
        { title, newSlug, status, seo, sectionOrder, sections },
        user
      );

      res.status(200).json({
        success: true,
        message: 'Page updated successfully',
        data: updatedPage,
      });
    } catch (error) {
      next(error);
    }
  }

  // CMS/Admin Endpoint: DELETE /api/pages/:slug
  async deletePage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      await pageService.deletePage(slug as string);

      res.status(200).json({
        success: true,
        message: 'Page deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // CMS/Admin Endpoint: PATCH /api/pages/:slug/publish
  async publishPage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const user = req.user ? { id: req.user.id, name: req.user.username } : undefined;

      const publishedPage = await pageService.publishPage(slug as string, user);

      res.status(200).json({
        success: true,
        message: 'Page published successfully',
        data: publishedPage,
      });
    } catch (error) {
      next(error);
    }
  }

  // CMS/Admin Endpoint: PATCH /api/pages/:slug/unpublish
  async unpublishPage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const user = req.user ? { id: req.user.id, name: req.user.username } : undefined;

      const unpublishedPage = await pageService.unpublishPage(slug as string, user);

      res.status(200).json({
        success: true,
        message: 'Page unpublished successfully',
        data: unpublishedPage,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const pageController = new PageController();
