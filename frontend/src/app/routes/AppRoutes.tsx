import { Routes, Route } from "react-router-dom"
import Home from "../../pages/public/Home"
import About from "../../pages/public/About"
import Blog from "../../pages/public/Blog"
import BlogDetail from "../../pages/public/BlogDetail"
import AdminLogin from '../../pages/admin/AdminLogin'
import AdminDashboard from '../../pages/admin/AdminDashboard'
import Posts from '../../pages/admin/Posts'
import CreatePost from '../../pages/admin/CreatePost'
import EditPost from '../../pages/admin/EditPost'
import PreviewPost from '../../pages/admin/PreviewPost'
import EmptyPosts from '../../pages/admin/EmptyPosts'

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/blog-detail" element={<BlogDetail />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard/>} />
            <Route path="/admin/posts" element={<Posts/>} />
            <Route path="/admin/posts/create" element={<CreatePost/>} />
            <Route path="/admin/posts/edit" element={<EditPost/>} />
            <Route path="/admin/posts/preview" element={<PreviewPost />} />
            <Route path="/admin/posts/empty" element={<EmptyPosts/>} />
        </Routes>
    )
}