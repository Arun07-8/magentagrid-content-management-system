import mongoose from 'mongoose';
import { PageModel, IPage, PageStatus, IPageSectionMeta, IPageSEO } from './page.model.js';
import { DEFAULT_PAGE_DATA } from './page.defaults.js';
import { AppError } from '../../middleware/error.middleware.js';
import { broadcastEvent } from '../../config/socket.js';

export class PageService {
  private isDbConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  /**
   * Seed default pages if they don't exist in DB yet
   */
  async ensureDefaultPagesExist(): Promise<void> {
    if (!this.isDbConnected()) return;

    for (const [slug, pageData] of Object.entries(DEFAULT_PAGE_DATA)) {
      const exists = await PageModel.findOne({ slug });
      if (!exists) {
        await PageModel.create({
          slug,
          title: pageData.title,
          status: 'Published',
          isSystem: pageData.isSystem,
          seo: pageData.seo,
          sectionOrder: pageData.sectionOrder,
          sections: pageData.sections,

          draftTitle: pageData.title,
          draftSeo: pageData.seo,
          draftSectionOrder: pageData.sectionOrder,
          draftSections: pageData.sections,

          publishedTitle: pageData.title,
          publishedSeo: pageData.seo,
          publishedSectionOrder: pageData.sectionOrder,
          publishedSections: pageData.sections,
          publishedAt: new Date(),
        });
      } else if (!exists.publishedSections || Object.keys(exists.publishedSections).length === 0) {
        // Backfill initial published state for pre-existing system pages
        exists.publishedSections = exists.draftSections || exists.sections || pageData.sections;
        exists.publishedSectionOrder = exists.draftSectionOrder || exists.sectionOrder || pageData.sectionOrder;
        exists.publishedTitle = exists.draftTitle || exists.title || pageData.title;
        exists.publishedSeo = exists.draftSeo || exists.seo || pageData.seo;

        exists.draftSections = exists.draftSections || exists.sections || pageData.sections;
        exists.draftSectionOrder = exists.draftSectionOrder || exists.sectionOrder || pageData.sectionOrder;
        exists.draftTitle = exists.draftTitle || exists.title || pageData.title;
        exists.draftSeo = exists.draftSeo || exists.seo || pageData.seo;
        await exists.save();
      }
    }
  }

  /**
   * Get public page content (strictly ONLY published snapshot)
   */
  async getPublicPageBySlug(slug: string): Promise<any> {
    const cleanSlug = slug.toLowerCase().trim();

    if (!this.isDbConnected()) {
      const fallback = DEFAULT_PAGE_DATA[cleanSlug];
      if (!fallback) throw new AppError('Page not found', 404);
      return {
        slug: cleanSlug,
        title: fallback.title,
        status: 'Published',
        seo: fallback.seo,
        sectionOrder: fallback.sectionOrder,
        sections: fallback.sections,
      };
    }

    await this.ensureDefaultPagesExist();

    const page = await PageModel.findOne({ slug: cleanSlug });
    if (!page) {
      const fallback = DEFAULT_PAGE_DATA[cleanSlug];
      if (!fallback) throw new AppError('Page not found', 404);
      return {
        slug: cleanSlug,
        title: fallback.title,
        status: 'Published',
        seo: fallback.seo,
        sectionOrder: fallback.sectionOrder,
        sections: fallback.sections,
      };
    }

    if (page.status !== 'Published' && cleanSlug !== 'home') {
      throw new AppError('Page is currently in draft mode', 403);
    }

    // Serve strictly published snapshots to the public website
    const finalSections = page.publishedSections && Object.keys(page.publishedSections).length > 0
      ? page.publishedSections
      : page.draftSections || page.sections;

    const finalOrder = page.publishedSectionOrder && page.publishedSectionOrder.length > 0
      ? page.publishedSectionOrder
      : page.draftSectionOrder || page.sectionOrder;

    return {
      slug: page.slug,
      title: page.publishedTitle || page.title,
      status: page.status,
      seo: page.publishedSeo || page.seo,
      sectionOrder: finalOrder,
      sections: finalSections,
    };
  }

  /**
   * Get all pages for CMS management (Returns Draft working copy)
   */
  async getAllPages(): Promise<IPage[]> {
    if (!this.isDbConnected()) {
      return Object.entries(DEFAULT_PAGE_DATA).map(([slug, data]) => ({
        slug,
        title: data.title,
        status: 'Published' as PageStatus,
        isSystem: data.isSystem,
        seo: data.seo,
        sectionOrder: data.sectionOrder,
        sections: data.sections,
        draftSections: data.sections,
        publishedSections: data.sections,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any));
    }

    await this.ensureDefaultPagesExist();
    const pages = await PageModel.find().sort({ createdAt: 1 });

    const formattedPages = pages.map((page) => {
      const obj = page.toObject();
      return {
        ...obj,
        title: page.draftTitle || page.title,
        seo: page.draftSeo || page.seo,
        sectionOrder: page.draftSectionOrder || page.sectionOrder || [],
        sections: page.draftSections || page.sections || {},
      };
    });

    // Ensure 'home' is first
    return formattedPages.sort((a, b) => {
      if (a.slug === 'home') return -1;
      if (b.slug === 'home') return 1;
      return a.title.localeCompare(b.title);
    }) as any;
  }

  /**
   * Get a single page by slug for CMS editing (Returns Draft working copy)
   */
  async getPageBySlug(slug: string): Promise<IPage> {
    const cleanSlug = slug.toLowerCase().trim();

    if (!this.isDbConnected()) {
      const fallback = DEFAULT_PAGE_DATA[cleanSlug];
      if (!fallback) throw new AppError('Page not found', 404);
      return {
        slug: cleanSlug,
        title: fallback.title,
        status: 'Published' as PageStatus,
        isSystem: fallback.isSystem,
        seo: fallback.seo,
        sectionOrder: fallback.sectionOrder,
        sections: fallback.sections,
        draftSections: fallback.sections,
        publishedSections: fallback.sections,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;
    }

    await this.ensureDefaultPagesExist();

    const page = await PageModel.findOne({ slug: cleanSlug });
    if (!page) {
      throw new AppError('Page not found', 404);
    }

    const obj = page.toObject();
    return {
      ...obj,
      title: page.draftTitle || page.title,
      seo: page.draftSeo || page.seo,
      sectionOrder: page.draftSectionOrder || page.sectionOrder || [],
      sections: page.draftSections || page.sections || {},
    } as any;
  }

  /**
   * Create a new custom page (Saved initially as Draft)
   */
  async createPage(
    payload: {
      title: string;
      slug: string;
      seo?: IPageSEO;
      sectionOrder?: IPageSectionMeta[];
      sections?: Record<string, any>;
    },
    user?: { id: string; name: string; role?: string }
  ): Promise<IPage> {
    if (!this.isDbConnected()) {
      throw new AppError('Database is not connected', 503);
    }

    const cleanSlug = payload.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
    if (!cleanSlug) {
      throw new AppError('Valid page slug is required', 400);
    }

    const existing = await PageModel.findOne({ slug: cleanSlug });
    if (existing) {
      throw new AppError(`A page with slug "/${cleanSlug}" already exists`, 409);
    }

    const defaultSection = {
      id: 'richContent',
      type: 'richText',
      name: 'Content Section',
      isEnabled: true,
    };

    const initialSections = payload.sections || {
      richContent: {
        badgeText: 'PAGE CONTENT',
        heading: payload.title,
        content: 'Add your custom page content here using the CMS editor.',
      },
    };

    const initialOrder = payload.sectionOrder || [defaultSection];
    const initialSeo = payload.seo || {
      metaTitle: `${payload.title} | Editorial`,
      metaDescription: '',
    };

    const newPage = await PageModel.create({
      title: payload.title || 'Untitled Page',
      slug: cleanSlug,
      status: 'Draft',
      isSystem: false,
      seo: initialSeo,
      sectionOrder: initialOrder,
      sections: initialSections,

      draftTitle: payload.title || 'Untitled Page',
      draftSeo: initialSeo,
      draftSectionOrder: initialOrder,
      draftSections: initialSections,

      publishedTitle: '',
      publishedSeo: { metaTitle: '', metaDescription: '' },
      publishedSectionOrder: [],
      publishedSections: {},

      updatedBy: user ? { id: new mongoose.Types.ObjectId(user.id), name: user.name } : undefined,
    });

    broadcastEvent('pages:draft_updated', {
      action: 'create',
      slug: newPage.slug,
      status: newPage.status,
    });

    return newPage;
  }

  /**
   * Update page content, section order, SEO or slug (Save Draft vs Publish)
   */
  async updatePage(
    slug: string,
    payload: {
      title?: string;
      newSlug?: string;
      status?: PageStatus;
      seo?: IPageSEO;
      sectionOrder?: IPageSectionMeta[];
      sections?: Record<string, any>;
    },
    user?: { id: string; name: string; role?: string }
  ): Promise<IPage> {
    if (!this.isDbConnected()) {
      throw new AppError('Database is not connected', 503);
    }

    await this.ensureDefaultPagesExist();

    const existingPage = await PageModel.findOne({ slug: slug.toLowerCase().trim() });
    if (!existingPage) {
      throw new AppError('Page not found', 404);
    }

    const isExplicitPublish = payload.status === 'Published';

    // Role Enforcement: Editors are strictly prohibited from changing publishing status or setting status to Published
    if (user?.role === 'editor') {
      if (isExplicitPublish) {
        throw new AppError('Access forbidden: Editors are not authorized to publish pages or set status to Published.', 403);
      }
      if (payload.status !== undefined && payload.status !== existingPage.status) {
        throw new AppError('Access forbidden: Editors are not authorized to change page publishing status.', 403);
      }
      delete payload.status;
    }

    // Always update draft working state
    if (payload.title !== undefined) {
      existingPage.title = payload.title;
      existingPage.draftTitle = payload.title;
    }
    if (payload.seo !== undefined) {
      existingPage.seo = payload.seo;
      existingPage.draftSeo = payload.seo;
    }
    if (payload.sectionOrder !== undefined) {
      existingPage.sectionOrder = payload.sectionOrder;
      existingPage.draftSectionOrder = payload.sectionOrder;
    }
    if (payload.sections !== undefined) {
      existingPage.sections = payload.sections;
      existingPage.draftSections = payload.sections;
    }

    // Update status if provided by an authorized user
    if (payload.status !== undefined) {
      existingPage.status = payload.status;
    }

    // ONLY update published snapshot when explicitly published by an authorized user (Admin)
    if (isExplicitPublish) {
      existingPage.publishedTitle = existingPage.draftTitle || existingPage.title;
      existingPage.publishedSeo = JSON.parse(JSON.stringify(existingPage.draftSeo || existingPage.seo || {}));
      existingPage.publishedSectionOrder = JSON.parse(JSON.stringify(existingPage.draftSectionOrder || existingPage.sectionOrder || []));
      existingPage.publishedSections = JSON.parse(JSON.stringify(existingPage.draftSections || existingPage.sections || {}));
      existingPage.status = 'Published';
      existingPage.publishedAt = new Date();
    }

    // Slug renaming (only allowed if not a system page)
    if (payload.newSlug && payload.newSlug !== existingPage.slug && !existingPage.isSystem) {
      const cleanNewSlug = payload.newSlug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
      const slugConflict = await PageModel.findOne({ slug: cleanNewSlug });
      if (slugConflict) {
        throw new AppError(`Slug "/${cleanNewSlug}" is already in use`, 409);
      }
      existingPage.slug = cleanNewSlug;
    }

    if (user) {
      existingPage.updatedBy = {
        id: new mongoose.Types.ObjectId(user.id),
        name: user.name,
      };
    }

    const saved = await existingPage.save();

    if (isExplicitPublish || payload.status === 'Draft') {
      broadcastEvent('pages:changed', {
        action: isExplicitPublish ? 'publish' : 'unpublish',
        slug: saved.slug,
        status: saved.status,
      });
    } else {
      broadcastEvent('pages:draft_updated', {
        action: 'draft_update',
        slug: saved.slug,
        status: saved.status,
      });
    }

    return saved;
  }

  /**
   * Delete a page (strictly custom non-system pages - Admin Only)
   */
  async deletePage(slug: string, user?: { id: string; name: string; role?: string }): Promise<void> {
    if (!this.isDbConnected()) {
      throw new AppError('Database is not connected', 503);
    }

    const userRole = (user?.role || '').toLowerCase().trim();
    if (userRole === 'editor') {
      throw new AppError('Access forbidden: Editors are not authorized to delete pages.', 403);
    }

    const cleanSlug = slug.toLowerCase().trim();
    if (cleanSlug === 'home') {
      throw new AppError('Root Home page cannot be deleted', 400);
    }

    const page = await PageModel.findOne({ slug: cleanSlug });
    if (!page) {
      throw new AppError('Page not found', 404);
    }

    if (page.isSystem && cleanSlug === 'home') {
      throw new AppError('System root page cannot be deleted', 400);
    }

    await PageModel.deleteOne({ slug: cleanSlug });

    broadcastEvent('pages:changed', {
      action: 'delete',
      slug: cleanSlug,
    });
  }

  /**
   * Publish page (Admin Only)
   */
  async publishPage(slug: string, user?: { id: string; name: string; role?: string }): Promise<IPage> {
    if (user?.role === 'editor') {
      throw new AppError('Access forbidden: Editors are not authorized to publish pages.', 403);
    }
    return this.updatePage(slug, { status: 'Published' }, user);
  }

  /**
   * Unpublish page (Set to Draft - Admin Only)
   */
  async unpublishPage(slug: string, user?: { id: string; name: string; role?: string }): Promise<IPage> {
    if (user?.role === 'editor') {
      throw new AppError('Access forbidden: Editors are not authorized to unpublish pages.', 403);
    }
    return this.updatePage(slug, { status: 'Draft' }, user);
  }
}
