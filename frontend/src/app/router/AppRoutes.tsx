import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../../pages/public/home';
import AboutPage from '../../pages/public/about';
import BlogPage from '../../pages/public/blog';
import BlogDetailPage from '../../pages/public/blog-detail';
import NotFoundPage from '../../pages/public/not-found';

import AdminLoginPage from '../../pages/admin/login';
import AdminDashboardPage from '../../pages/admin/dashboard';
import AdminPostsPage from '../../pages/admin/posts';
import PostCreatePage from '../../pages/admin/post-create';
import PostEditPage from '../../pages/admin/post-edit';
import PostPreviewPage from '../../pages/admin/post-preview';
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
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
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
