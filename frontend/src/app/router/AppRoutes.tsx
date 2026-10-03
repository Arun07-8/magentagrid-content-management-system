import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../../pages/public/HomePage';
import AboutPage from '../../pages/public/AboutPage';
import BlogPage from '../../pages/public/BlogPage';
import BlogDetailPage from '../../pages/public/BlogDetailPage';
import NotFoundPage from '../../pages/public/NotFoundPage';

import AdminLoginPage from '../../pages/admin/AdminLoginPage';
import AdminPostsPage from '../../pages/admin/AdminPostsPage';
import PostCreatePage from '../../pages/admin/PostCreatePage';
import PostEditPage from '../../pages/admin/PostEditPage';
import PostPreviewPage from '../../pages/admin/PostPreviewPage';
import { ProtectedRoute } from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC ROUTES*/}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:id" element={<BlogDetailPage />} />
      <Route path="/blog-detail" element={<BlogDetailPage />} />
      <Route path="/news" element={<BlogPage />} />
      <Route path="/news/:id" element={<BlogDetailPage />} />


      {/* ADMIN ROUTES */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={<Navigate to="/admin/posts" replace />}
      />
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

      <Route
        path="/admin/posts/empty"
        element={
          <ProtectedRoute>
            <Navigate to="/admin/posts" replace />
          </ProtectedRoute>
        }
      />

      {/* 404 UNKNOWN ROUTE*/}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
