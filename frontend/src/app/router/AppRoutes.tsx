import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../../pages/public/HomePage';
import AboutPage from '../../pages/public/AboutPage';
import BlogPage from '../../pages/public/BlogPage';
import BlogDetailPage from '../../pages/public/BlogDetailPage';
import DynamicCustomPage from '../../pages/public/DynamicCustomPage';
import NotFoundPage from '../../pages/public/NotFoundPage';

import AdminLoginPage from '../../pages/admin/AdminLoginPage';
import AdminPostsPage from '../../pages/admin/AdminPostsPage';
import PostCreatePage from '../../pages/admin/PostCreatePage';
import PostEditPage from '../../pages/admin/PostEditPage';
import PostPreviewPage from '../../pages/admin/PostPreviewPage';
import AdminPagesPage from '../../pages/admin/AdminPagesPage';
import PageEditPage from '../../pages/admin/PageEditPage';
import PagePreviewPage from '../../pages/admin/PagePreviewPage';
import PagePreviewFrame from '../../pages/admin/PagePreviewFrame';
import PostPreviewFrame from '../../pages/admin/PostPreviewFrame';
import { ProtectedRoute } from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC CLEAN ROUTES */}
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<HomePage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/contact" element={<HomePage />} />
      <Route path="/news" element={<Navigate to="/blog" replace />} />
      <Route path="/page/:slug" element={<DynamicCustomPage />} />
      <Route path="/p/:slug" element={<DynamicCustomPage />} />

      {/* INDIVIDUAL ARTICLE DETAIL ROUTES */}
      <Route path="/blog/:id" element={<BlogDetailPage />} />
      <Route path="/blog-detail" element={<BlogDetailPage />} />
      <Route path="/news/:id" element={<BlogDetailPage />} />

      {/* ADMIN ROUTES */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={<Navigate to="/admin/posts" replace />}
      />

      {/* POSTS CMS ROUTES */}
      <Route
        path="/admin/posts"
        element={
          <ProtectedRoute>
            <AdminPostsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/posts/create"
        element={
          <ProtectedRoute>
            <PostCreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/posts/edit/:id"
        element={
          <ProtectedRoute>
            <PostEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/posts/edit"
        element={
          <ProtectedRoute>
            <PostEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/posts/preview/:id"
        element={
          <ProtectedRoute>
            <PostPreviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/posts/preview"
        element={
          <ProtectedRoute>
            <PostPreviewPage />
          </ProtectedRoute>
        }
      />

      {/* PAGES CMS ROUTES */}
      <Route
        path="/admin/pages"
        element={
          <ProtectedRoute>
            <AdminPagesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pages/edit/:slug"
        element={
          <ProtectedRoute>
            <PageEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pages/edit"
        element={
          <ProtectedRoute>
            <Navigate to="/admin/pages" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pages/preview/:slug"
        element={
          <ProtectedRoute>
            <PagePreviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pages/preview"
        element={
          <ProtectedRoute>
            <Navigate to="/admin/pages" replace />
          </ProtectedRoute>
        }
      />

      {/* PREVIEW FRAME EMBED ROUTES FOR TRUE RESPONSIVE VIEWPORTS */}
      <Route path="/admin/preview-frame/page/:slug" element={<PagePreviewFrame />} />
      <Route path="/admin/preview-frame/page" element={<PagePreviewFrame />} />
      <Route path="/admin/preview-frame/post/:id" element={<PostPreviewFrame />} />
      <Route path="/admin/preview-frame/post" element={<PostPreviewFrame />} />

      {/* 404 UNKNOWN ROUTE */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
