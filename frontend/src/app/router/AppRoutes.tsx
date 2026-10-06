import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../../pages/public/HomePage';
import AboutPage from '../../pages/public/AboutPage';
import DynamicCustomPage from '../../pages/public/DynamicCustomPage';
import NotFoundPage from '../../pages/public/NotFoundPage';

import AdminLoginPage from '../../pages/admin/AdminLoginPage';
import AdminPagesPage from '../../pages/admin/AdminPagesPage';
import PageEditPage from '../../pages/admin/PageEditPage';
import PagePreviewPage from '../../pages/admin/PagePreviewPage';
import PagePreviewFrame from '../../pages/admin/PagePreviewFrame';
import { ProtectedRoute } from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC CLEAN ROUTES */}
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<HomePage />} />
      <Route path="/contact" element={<HomePage />} />
      <Route path="/page/:slug" element={<DynamicCustomPage />} />
      <Route path="/p/:slug" element={<DynamicCustomPage />} />

      {/* ADMIN AUTH & REDIRECT ROUTES */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={<Navigate to="/admin/pages" replace />}
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

      {/* PREVIEW FRAME EMBED ROUTES FOR RESPONSIVE SIMULATION */}
      <Route path="/admin/preview-frame/page/:slug" element={<PagePreviewFrame />} />
      <Route path="/admin/preview-frame/page" element={<PagePreviewFrame />} />

      {/* 404 UNKNOWN ROUTE */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
