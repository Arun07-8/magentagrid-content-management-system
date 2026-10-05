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
        });
      }
    }
  }

  /**
   * Get public page content (strictly only published)
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

    if (page.status !== 'Published') {
      throw new AppError('Page is currently in draft mode', 403);
    }

    return {
      slug: page.slug,
      title: page.title,
      status: page.status,
      seo: page.seo,
      sectionOrder: page.sectionOrder,
      sections: page.sections,
    };
  }

  /**
   * Get all pages for CMS management
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
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any));
    }

    await this.ensureDefaultPagesExist();
    const pages = await PageModel.find().sort({ createdAt: 1 });

    // Ensure 'home' is first
    return pages.sort((a, b) => {
      if (a.slug === 'home') return -1;
      if (b.slug === 'home') return 1;
      return a.title.localeCompare(b.title);
    });
  }

  /**
   * Get a single page by slug for CMS editing
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
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;
    }

    await this.ensureDefaultPagesExist();

    const page = await PageModel.findOne({ slug: cleanSlug });
    if (!page) {
      throw new AppError('Page not found', 404);
    }

    return page;
  }

  /**
   * Create a new custom page
   */
  async createPage(
    payload: {
      title: string;
      slug: string;
      seo?: IPageSEO;
      sectionOrder?: IPageSectionMeta[];
      sections?: Record<string, any>;
    },
    user?: { id: string; name: string }
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

    const newPage = await PageModel.create({
      title: payload.title || 'Untitled Page',
      slug: cleanSlug,
      status: 'Draft',
      isSystem: false,
      seo: payload.seo || {
        metaTitle: `${payload.title} | Editorial`,
        metaDescription: '',
      },
      sectionOrder: payload.sectionOrder || [defaultSection],
      sections: payload.sections || {
        richContent: {
          badgeText: 'PAGE CONTENT',
          heading: payload.title,
          content: 'Add your custom page content here using the CMS editor.',
        },
      },
      updatedBy: user ? { id: new mongoose.Types.ObjectId(user.id), name: user.name } : undefined,
    });

    broadcastEvent('pages:changed', {
      action: 'create',
      slug: newPage.slug,
      status: newPage.status,
    });

    return newPage;
  }

  /**
   * Update page content, section order, SEO or slug
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
    user?: { id: string; name: string }
  ): Promise<IPage> {
    if (!this.isDbConnected()) {
      throw new AppError('Database is not connected', 503);
    }

    await this.ensureDefaultPagesExist();

    const existingPage = await PageModel.findOne({ slug: slug.toLowerCase().trim() });
    if (!existingPage) {
      throw new AppError('Page not found', 404);
    }

    if (payload.title !== undefined) existingPage.title = payload.title;
    if (payload.status !== undefined) existingPage.status = payload.status;
    if (payload.seo !== undefined) existingPage.seo = payload.seo;
    if (payload.sectionOrder !== undefined) existingPage.sectionOrder = payload.sectionOrder;
    if (payload.sections !== undefined) existingPage.sections = payload.sections;

    // Slug renaming (only allowed if not a system page like 'home')
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

    broadcastEvent('pages:changed', {
      action: 'update',
      slug: saved.slug,
      status: saved.status,
    });

    return saved;
  }

  /**
   * Delete a page (strictly custom non-system pages)
   */
  async deletePage(slug: string): Promise<void> {
    if (!this.isDbConnected()) {
      throw new AppError('Database is not connected', 503);
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
   * Publish page
   */
  async publishPage(slug: string, user?: { id: string; name: string }): Promise<IPage> {
    return this.updatePage(slug, { status: 'Published' }, user);
  }

  /**
   * Unpublish page (Set to Draft)
   */
  async unpublishPage(slug: string, user?: { id: string; name: string }): Promise<IPage> {
    return this.updatePage(slug, { status: 'Draft' }, user);
  }
}
