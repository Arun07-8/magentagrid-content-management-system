# Content Management System (CMS) Platform

A full-stack, responsive Content Management System (CMS) built with **React + TypeScript** on the frontend and **Node.js/Express + MongoDB** on the backend. Designed with role-based access control (Admin & Editor), secure JWT authentication via HttpOnly cookies with automatic token refresh, real-time cross-client data synchronization via Socket.IO, multi-device preview simulation, and a Feature-Sliced Design (FSD) architecture.

---

## 📌 Submission Overview & Quick Links

- **Git Repository**: [https://github.com/Arun07-8/magentagrid-content-management-system.git](https://github.com/Arun07-8/magentagrid-content-management-system.git)
- **Deployment Status**: Configured for local evaluation (`http://localhost:5173` frontend & `http://localhost:5000` backend).

---

## 🔐 Test Login Credentials

The application provides seeded accounts with distinct role capabilities:

| Role | Email | Password | Allowed Actions |
| :--- | :--- | :--- | :--- |
| **Admin** | `arunadmin@gmail.com` | `Admin123!` | Full access: View, Create, Edit, Publish, Unpublish, Delete pages and update settings |
| **Editor** | `aruneditor@gmail.com` | `Admin123!` | Limited access: View, Edit pages (Cannot Publish, Unpublish, or Delete) |

*Alternative seeded test accounts*:
- Admin: `adminarun@gmail.com` / `Admin123!`
- Editor: `test.editor@example.com` / `Admin123!`

---

## 🛠️ Setup & Running Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/cms`) or MongoDB Atlas URI

### 1. Clone Repository & Install Dependencies

```bash
git clone https://github.com/Arun07-8/magentagrid-content-management-system.git
cd magentagrid-content-management-system
```

#### Backend Setup:
```bash
cd backend
npm install
```

#### Frontend Setup:
```bash
cd frontend
npm install
```

---

### 2. Environment Configuration

#### Backend Environment (`backend/.env`)
Create `backend/.env` (or use existing `.env`):
```env
PORT=5000
JWT_ACCESS_SECRET=7vK9mQ2xL8pR4tY6nW3zA9cF5hJ1sD8e
JWT_REFRESH_SECRET=Q4xN7kP2vM9rL6tY3wF8cZ1aH5sE0uB7
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL_DAYS=7
MONGODB_URI="mongodb://localhost:27017/cms"
```

#### Frontend Environment (`frontend/.env`)
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

### 3. CLI User Creation Scripts

Create Admin or Editor accounts directly from the terminal:

```bash
cd backend

# Create an Admin User
npm run create:admin

# Create an Editor User
npm run create:editor
```

**CLI Prompt Interaction**:
```text
Username: newadmin
Email: newadmin@example.com
Password: ******** (masked)

Admin user created successfully.
Username: newadmin
Email: newadmin@example.com
Role: Admin
```
- Validates input format (non-empty username/email, email regex, min 6-char password).
- Checks for duplicate username or email in MongoDB.
- Automatically hashes passwords via `bcryptjs` before persisting.
- Masked password input in terminal.

---

### 4. Running the Application

#### Step 1: Start Backend Server
```bash
cd backend
npm run dev
```
*Backend runs on `http://localhost:5000` (Health check: `http://localhost:5000/api/health`).*

#### Step 2: Start Frontend Development Server
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🌟 Main Features

### Public Website
- **Home (`/`)**: Hero banner, services capabilities, why choose us features, 3-step process methodology, testimonials, and contact section.
- **About (`/about`)**: Structured overview of philosophy, pillars, capabilities, mission/vision, and guiding principles.
- **Services (`/services`)**: Single-page smooth anchor routing to capabilities & solutions.
- **Contact (`/contact`)**: Editorial desk inquiries, contact details, and response commitment.
- **Dynamic Pages (`/page/:slug` & `/p/:slug`)**: Bespoke CMS-managed modular pages.
- **404 Fallback (`*`)**: Custom configurable not found page.

### Protected Admin CMS
- **Pages Management (`/admin/pages`)**: Centralized dashboard to configure global Navbar, Home page, About page, Contact desk, Footer, 404 Fallback, and custom dynamic pages.
- **Page Editor (`/admin/pages/edit/:slug`)**: Modular block-level builder with drag-and-drop section ordering, image cropping, and section enable/disable controls.
- **Responsive Simulator Preview (`/admin/pages/preview/:slug`)**: Real-time page preview with device width toggles (**Desktop ~1280px**, **Tablet ~768px**, **Mobile ~390px**).
- **Draft & Publish Lifecycle**: Instant toggle between draft staging and live broadcast.

### Authentication & Session Management
- **Dual JWT + HttpOnly Cookie Flow**: Short-lived access token (`15m` TTL) and refresh token (`7d` TTL) stored in HttpOnly cookies (`cms_token`, `cms_refresh_token`).
- **Seamless Page Refresh**: `checkAuth()` verifies `/api/auth/me` on startup. If access token is expired, `apiClient` automatically initiates a single-flight `/api/auth/refresh` call and retries pending requests without logging out the user.
- **ProtectedRoute Guard**: Prevents premature redirection to `/admin/login` while initial session check is pending by rendering a clean loading indicator.

### Role-Based Authorization
- **Admin**: Full permissions (Create, View, Edit, Publish, Unpublish, Delete).
- **Editor**: Limited permissions (Create, View, Edit). Protected actions (Publish, Unpublish, Delete) are disabled in the UI and enforced at the backend middleware level (`requireRole('admin')` returning `403 Forbidden`).

### Real-Time Synchronization
- Socket.IO broadcasts `pages:changed` and `settings:changed` events on mutations.
- TanStack Query automatically invalidates query caches in open browser windows without requiring manual page reloads.

---

### Responsive Design
- Optimized across all breakpoints: **Desktop (1920px/1440px)**, **Laptop (1366px)**, **Tablet (1024px/768px)**, **Mobile (430px/390px)**, and **Small Mobile (320px)**.
- Slide-over mobile navigation drawer on public header (`Navbar.tsx`) and admin layout (`AdminSidebar.tsx`).

---

## 🏗️ Architecture & Project Structure

### Backend Architecture: Modular Monolith
The backend isolates business modules with clear boundaries and centralized middleware:

```
backend/
├── src/
│   ├── cli/                   # User creation CLI commands
│   │   ├── createAdmin.ts     # Admin creation entrypoint
│   │   ├── createEditor.ts    # Editor creation entrypoint
│   │   └── userPrompt.ts      # Shared masked input & DB creation handler
│   ├── config/                # Environment, DB & Socket setup
│   │   ├── env.ts             # Zod type-safe environment configuration
│   │   ├── db.ts              # MongoDB Mongoose connection handler
│   │   └── socket.ts          # Socket.IO server broadcaster
│   ├── middleware/            # Express middlewares
│   │   ├── auth.middleware.ts # JWT verification (Cookie & Bearer)
│   │   ├── role.middleware.ts # Role guard (Admin / Editor)
│   │   ├── validate.middleware.ts # Zod schema validator
│   │   ├── upload.middleware.ts   # Multer file upload handler
│   │   └── error.middleware.ts    # Centralized error middleware
│   ├── modules/               # Domain business modules
│   │   ├── auth/              # Auth module (User model, Controller, Service, Routes)
│   │   ├── pages/             # Pages module (Page model, Controller, Service, Routes, Defaults)
│   │   └── settings/          # Settings module (Settings model, Controller, Service, Routes)
│   ├── utils/
│   │   └── logger.ts          # Winston logger
│   ├── app.ts                 # Express application setup & CORS configuration
│   └── server.ts              # HTTP server & Socket.IO initialization
```

### Frontend Architecture: Feature-Sliced Design (FSD)
The frontend separates responsibilities into layers:

```
frontend/
├── src/
│   ├── app/                   # App setup, providers & router
│   │   ├── App.tsx            # App root
│   │   ├── providers/         # QueryProvider & auth check
│   │   └── router/            # AppRoutes & ProtectedRoute
│   ├── pages/                 # Full page components
│   │   ├── public/            # HomePage, AboutPage, DynamicCustomPage, NotFoundPage
│   │   └── admin/             # AdminLoginPage, AdminPagesPage, PageEditPage, PagePreviewPage, PagePreviewFrame
│   ├── widgets/               # Layout components (Navbar, Footer, AdminSidebar, AdminHeader, AdminLayout, PublicLayout)
│   ├── features/              # Use-case modules
│   │   └── auth/              # LoginForm, useAuth, authApi
│   ├── entities/              # Core business entities
│   │   ├── user/              # userStore (Zustand) & session check
│   │   ├── page/              # pageApi, usePages, defaultPageContent
│   │   └── settings/          # settingsApi, useSettings, types
│   └── shared/                # Primitives & utilities
│       ├── api/               # apiClient (fetch wrapper with auto-refresh interceptor)
│       ├── lib/               # Utility formatters & helpers
│       ├── ui/                # Logo, Spinner, Button, Badge, Toast, ImageCropModal
│       └── types/             # Shared TypeScript types
```

---

## 💻 Technology Stack

### Frontend
- **React 19 + TypeScript**: UI component layer with static type checking.
- **React Router DOM v7**: Declarative client-side routing & protected route management.
- **TanStack Query (React Query) v5**: Asynchronous server-state management, query caching, and cache invalidation.
- **Zustand v5**: Lightweight client authentication & session store.
- **Tailwind CSS v4**: Responsive utility-first styling.
- **Socket.IO Client v4**: WebSockets for real-time `pages:changed` and `settings:changed` listeners.
- **Lucide React**: Modern icon primitives.
- **Vite v8**: Development server & production bundler.

### Backend
- **Node.js + Express 5**: Core REST API application framework.
- **TypeScript**: End-to-end type safety.
- **MongoDB + Mongoose 9**: Document database & ODM schema modeling.
- **JSON Web Tokens (jwt) & bcryptjs**: Cryptographic authentication tokens and password hashing.
- **cookie-parser**: Parses HttpOnly auth cookies (`cms_token`, `cms_refresh_token`).
- **Socket.IO v4**: WebSocket server for broadcasting real-time events.
- **Zod 4**: Schema validation for request payloads and environment variables.
- **Winston**: Structured HTTP request & application logging.
- **tsx**: TypeScript execution engine for dev server and CLI scripts.