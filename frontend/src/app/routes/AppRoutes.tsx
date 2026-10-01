import { Routes, Route } from "react-router-dom"
import Home from "../../pages/public/Home"
import About from "../../pages/public/About"
import Blog from "../../pages/public/Blog"
import BlogDetail from "../../pages/public/BlogDetail"
import NotFound from "../../pages/public/NotFound"
import AdminLogin from '../../pages/admin/AdminLogin'
import AdminDashboard from '../../pages/admin/AdminDashboard'
import Posts from '../../pages/admin/Posts'
import CreatePost from '../../pages/admin/CreatePost'
import EditPost from '../../pages/admin/EditPost'
import PreviewPost from '../../pages/admin/PreviewPost'
import EmptyPosts from '../../pages/admin/EmptyPosts'
import { ProtectedRoute } from "./ProtectedRoute"

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/blog-detail" element={<BlogDetail />} />
            {/* News Aliases as required by Technical Test */}
            <Route path="/news" element={<Blog />} />
            <Route path="/news/:id" element={<BlogDetail />} />

            {/* Admin Login Route (Public for login) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected CMS Routes */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/posts"
                element={
                    <ProtectedRoute>
                        <Posts />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/posts/create"
                element={
                    <ProtectedRoute>
                        <CreatePost />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/posts/edit/:id"
                element={
                    <ProtectedRoute>
                        <EditPost />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/posts/edit"
                element={
                    <ProtectedRoute>
                        <EditPost />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/posts/preview/:id"
                element={
                    <ProtectedRoute>
                        <PreviewPost />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/posts/preview"
                element={
                    <ProtectedRoute>
                        <PreviewPost />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/posts/empty"
                element={
                    <ProtectedRoute>
                        <EmptyPosts />
                    </ProtectedRoute>
                }
            />

            {/* 404 Unknown Route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}