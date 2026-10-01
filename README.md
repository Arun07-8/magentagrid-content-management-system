# Magentagrid CMS Platform

A clean, modern, and maintainable Content Management System (CMS) built with a **React + TypeScript** frontend and a **Node.js/Express + MongoDB** backend.

---

## 1. Project Overview

The Magentagrid CMS is developed according to the requirements of the **Magentagrid React & TypeScript CMS Technical Test**. It demonstrates a clean separation of concerns, robust type safety, role-based authorization, real-time cross-client data synchronization, and responsive user experience.

### Key Capabilities
- **Public Website Pages**:
  - **Home**: Hero banner, latest updates, and featured published articles.
  - **About**: Company mission, vision, values, and milestone stats.
  - **News / Blog Listing**: Filterable by category, searchable by title/content, with responsive grid and pagination.
  - **News / Blog Details**: Full article presentation with metadata, reading time, author, and related published posts.
  - **404 Not Found Page**: Friendly fallback with navigation to home.
- **CMS Management**:
  - **Dashboard**: Overview statistics (Total Posts, Published, Drafts, Views), real-time indicator, and quick links.
  - **Post List**: Comprehensive view with status pills, pagination, and context action dropdown.
  - **Create Post**: Reusable form with validation, Markdown/rich toolbar helpers, image URL preview, and status controls.
  - **Edit Post**: Edit title, short description, body content, and metadata with unsaved input preservation.
  - **Preview Post**: Multi-device simulator supporting **Desktop**, **Tablet**, and **Mobile** responsive widths using the shared post-rendering component.
  - **Publish / Unpublish**: Fast one-click state transitions with instant server and client reflection.
  - **Delete Post**: Safe deletion workflow with confirmation modal.
- **Strict Role Permissions**:
  - **Admin**: Full access (Create, View, Edit, Publish, Unpublish, Delete).
  - **Editor**: Limited access (Create, View, Edit; cannot Publish, Unpublish, or Delete). Both frontend UI and backend API independently enforce this rule.
- **Real-Time Synchronization**:
  - Socket.IO broadcasts all mutations (`posts:changed`).
  - TanStack Query automatically invalidates and updates server caches in open browser windows without manual page refresh.

---

## 2. Architecture & Design Principles

### Backend: Modular Monolithic Architecture
The backend follows a **Modular Monolithic Architecture** ensuring clear module boundaries, zero circular dependencies, and maintainable data ownership:

```
backend/
├── src/
│   ├── config/              # Centralized environment, database, and socket setup
│   │   ├── env.ts           # Type-safe environment validation via Zod
│   │   ├── db.ts            # MongoDB connection with informative error diagnostics
│   │   └── socket.ts        # Socket.IO initialization and real-time event broadcaster
│   ├── middleware/          # Cross-cutting HTTP middlewares
│   │   ├── auth.middleware.ts     # JWT bearer token verification
│   │   ├── role.middleware.ts     # Role authorization guard (Admin vs Editor)
│   │   ├── validate.middleware.ts # Zod request body validation
│   │   └── error.middleware.ts    # Centralized error handler (Zod, Mongoose, AppError)
│   ├── modules/             # Self-contained business modules
│   │   ├── auth/            # Authentication & Identity module
│   │   │   ├── user.model.ts      # Mongoose User schema & password hashing
│   │   │   ├── auth.validation.ts # Zod validation schemas
│   │   │   ├── auth.service.ts    # Authentication business logic & tokens
│   │   │   ├── auth.controller.ts # Route handlers
│   │   │   └── auth.routes.ts     # Express router definition
│   │   └── posts/           # Content Management module
│   │       ├── post.model.ts      # Mongoose Post schema with auto-readTime
│   │       ├── post.validation.ts # Zod validation schemas
│   │       ├── post.service.ts    # Post CRUD, publish logic, and dual-mode persistence
│   │       ├── post.controller.ts # Route handlers
│   │       └── post.routes.ts     # Public and protected Express routes
│   ├── utils/
│   │   ├── logger.ts        # Winston logger with automated directory initialization
│   │   └── seed.ts          # Seed utility for initial users and articles
│   ├── app.ts               # Express application builder (CORS, parser, routes)
│   ├── server.ts            # HTTP & Socket.IO server entrypoint
│   └── tests/               # Automated unit and integration tests
```

### Frontend: Feature-Sliced Architecture (FSD)
The frontend cleanly isolates application layers according to **Feature-Sliced Architecture** guidelines:

```
frontend/
├── src/
│   ├── app/                 # Application initialization, routing, and providers
│   │   ├── App.tsx          # App root component wrapped with QueryProvider
│   │   ├── providers/       # QueryClientProvider & global real-time listener
│   │   └── routes/          # AppRoutes & ProtectedRoute guards
│   ├── pages/               # Page composition
│   │   ├── public/          # Home, About, Blog, BlogDetail, NotFound
│   │   └── admin/           # AdminDashboard, AdminLogin, Posts, CreatePost, EditPost, PreviewPost, EmptyPosts
│   ├── features/            # User actions and use-case workflows
│   │   ├── auth/            # Auth hooks, API communication, and login form logic
│   │   └── post/            # PostForm reusable UI component with inline validation
│   ├── entities/            # Business entities and server cache hooks
│   │   ├── user/            # Zustand user authentication store & token handling
│   │   └── post/            # TanStack Query hooks, post API service, and PostView component
│   ├── shared/              # Reusable primitives and infrastructure
│   │   ├── api/             # apiClient (typed fetch wrapper) & socket client
│   │   └── types/           # TypeScript interfaces (User, Post, ApiResponse)
│   └── components/          # Reusable public layout components (Navbar, Footer, Logo)
```

---

## 3. Technology Stack

- **Frontend**:
  - React 19 + TypeScript
  - TailwindCSS v4
  - React Router DOM v7
  - TanStack Query (React Query) v5 (Server state, fetching & cache invalidation)
  - Zustand (Client authentication and session state)
  - Socket.IO Client (Real-time events)
  - Lucide React (Icons)
  - Vite v8 (Build tool & development server)
- **Backend**:
  - Node.js + Express 5
  - TypeScript (ES2022, NodeNext resolution)
  - MongoDB + Mongoose 9
  - Socket.IO Server (Real-time updates)
  - JSON Web Tokens (JWT) + BcryptJS (Authentication & password hashing)
  - Winston (Logging)
  - Zod 4 (Schema validation)
  - Native `node:test` + TSX (Automated test runner)

---

## 4. Setup & Running Instructions

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### 1. Clone & Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

---

### 2. Environment Configuration

#### Backend Configuration (`backend/.env`)
Create or edit `backend/.env`:
```env
PORT=5000
JWT_ACCESS_SECRET=7vK9mQ2xL8pR4tY6nW3zA9cF5hJ1sD8e
JWT_REFRESH_SECRET=Q4xN7kP2vM9rL6tY3wF8cZ1aH5sE0uB7
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL_DAYS=7
MONGODB_URI="mongodb://localhost:27017/magentagrid"
```

> [!NOTE]
> **MongoDB Resilience / Zero-Config Review**:
> The backend features **dual-mode persistence**. If a MongoDB instance (or Atlas cluster) is connected, all records persist directly to MongoDB. If MongoDB is unreachable (e.g. Atlas IP Access List restrictions), the backend automatically and seamlessly utilizes an in-memory repository pre-seeded with sample data. This allows immediate, zero-downtime evaluation.

#### Frontend Configuration (`frontend/.env`)
Create `frontend/.env` (optional, defaults are already pre-configured):
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

### 3. Running Locally

#### Start the Backend Server:
```bash
cd backend
npm run dev
```
*Backend runs on `http://localhost:5000` (API: `http://localhost:5000/api`).*

#### Start the Frontend Dev Server:
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 5. Test Credentials

The system includes pre-seeded test accounts with distinct roles:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@example.com` | `password123` | Full access: View, Create, Edit, Publish, Unpublish, Delete |
| **Editor** | `editor@example.com` | `password123` | Limited access: View, Create, Edit (Cannot Publish, Unpublish, or Delete) |

*The CMS login page (`/admin/login`) also includes quick-fill buttons to switch between Admin and Editor accounts instantly.*

---

## 6. Authentication & Permissions

1. **Authentication Flow**:
   - `POST /api/auth/login`: Validates credentials, compares hashed passwords via Bcrypt, and returns a signed JWT access token.
   - The token is securely stored by the frontend and attached automatically to subsequent API calls as `Authorization: Bearer <token>`.
2. **CMS Route Protection**:
   - The `ProtectedRoute` component inspects the client authentication state. Unauthenticated requests are immediately redirected to `/admin/login`.
3. **Backend Role Enforcement**:
   - The `requireRole('admin')` middleware guards sensitive routes (`PATCH /api/posts/:id/publish`, `PATCH /api/posts/:id/unpublish`, `DELETE /api/posts/:id`).
   - If an Editor attempts to call these endpoints directly (e.g., via Postman or script), the backend rejects the request with `403 Forbidden`.
   - Creating or editing posts with `status: 'Published'` as an Editor is independently rejected or forced to `'Draft'` status.

---

## 7. Real-Time Data Updates

The application employs **Socket.IO** for real-time synchronization between browser windows:
1. Whenever an Admin creates, updates, publishes, unpublishes, or deletes an article in the CMS, the backend emits a `posts:changed` event with the mutation action and post payload.
2. The frontend maintains an active socket connection configured in `QueryProvider`.
3. Upon receiving `posts:changed`, the frontend automatically calls:
   ```ts
   queryClient.invalidateQueries({ queryKey: ['posts'] });
   queryClient.invalidateQueries({ queryKey: ['public-posts'] });
   ```
4. **Verification Scenario**:
   - Open **Browser Window 1**: Public website (`http://localhost:5173/blog`).
   - Open **Browser Window 2**: CMS dashboard (`http://localhost:5173/admin/posts`).
   - When an article is published or modified in Window 2, Window 1 updates dynamically without manual browser refresh.

---

## 8. State Management & API Caching

- **Server State (TanStack Query)**:
  - `usePublicPosts(params)`: Queries published posts with 2-minute cache `staleTime`.
  - `useCmsPosts(params)`: Queries all CMS posts with 1-minute cache `staleTime`.
  - `useCreatePost`, `useUpdatePost`, `usePublishPost`, `useUnpublishPost`, `useDeletePost`: Perform mutations and trigger query invalidations.
- **Client State (Zustand)**:
  - `useUserStore`: Stores current user profile, JWT token, and role.
  - Automatically restored on page refresh from `localStorage`.
- **Separation of Concerns**:
  - Server data is never duplicated in ad-hoc local state variables.
  - Form state during editing is isolated within `PostForm`, ensuring input is retained even if a network request encounters an error.

---

## 9. API Overview

### Public Endpoints (No Auth Required)
- `GET /api/health` — Health check endpoint
- `GET /api/posts/public` — Retrieve published posts only (supports `?search=` and `?category=`)
- `GET /api/posts/public/:id` — Retrieve a single published post and increment read view count

### Authentication Endpoints
- `POST /api/auth/login` — Login with email and password
- `POST /api/auth/logout` — Invalidate user session
- `GET /api/auth/me` — Retrieve current authenticated user profile (`Bearer` token required)

### CMS Post Management Endpoints (`Bearer` Token Required)
- `GET /api/posts` — Get all posts (Draft & Published, supports `?search=` and `?status=`)
- `GET /api/posts/:id` — Get single post by ID (Admin & Editor)
- `POST /api/posts` — Create a new post (Admin & Editor)
- `PUT /api/posts/:id` — Update post details (Admin & Editor)
- `PATCH /api/posts/:id/publish` — Publish article (**Admin only**)
- `PATCH /api/posts/:id/unpublish` — Unpublish article (**Admin only**)
- `DELETE /api/posts/:id` — Delete article (**Admin only**)

---

## 10. Automated Testing

The project includes automated integration and unit tests covering essential requirements:
- Form validation constraint verification (Zod schemas)
- Password hashing & verification
- Admin & Editor authentication
- Unauthorized role access rejection (Editor blocked from publishing & deleting)
- Full article lifecycle (Create draft → Verify excluded from public site → Publish → Verify visible in public site → Unpublish → Delete)

To execute the test suite:
```bash
cd backend
npm test
```

Test Results:
```text
✔ Auth Service & Validation Tests (289ms)
  ✔ loginSchema validates email and password constraints
  ✔ Admin login succeeds with correct credentials
  ✔ Editor login succeeds with correct role
  ✔ Login fails with invalid password
✔ Post Module & Role-Based Permissions Tests (8ms)
  ✔ createPostSchema validates required fields
  ✔ Editor role is blocked from publishing post directly
  ✔ Admin role can create, publish, unpublish, and delete posts

ℹ tests 9 | pass 9 | fail 0
```

---

## 11. AI Assistance Used

In adherence to technical test disclosure rules:
- **Google Antigravity AI Assistant** was utilized to assist in inspecting the existing codebase, setting up modular monolithic routing, structuring TypeScript types, implementing TanStack Query hooks, configuring Socket.IO real-time communication, and writing automated test specifications.
- Every architectural choice, type definition, and file was reviewed and validated for simplicity, maintainability, and standards compliance.

---

## 12. Assumptions & Notes

1. **Routing Aliases**: Both `/blog` (from existing template) and `/news` (from technical test specifications) are supported and route to the same responsive blog listing and detail components.
2. **Device Preview Parity**: The CMS preview screen (`/admin/posts/preview/:id`) directly reuses the `PostView` component to ensure exact visual parity with the live public blog article view.
3. **Draft Isolation**: The public website and endpoints (`/api/posts/public`) strictly filter out drafts (`status: 'Published'`). Draft articles are only accessible to authenticated CMS users.