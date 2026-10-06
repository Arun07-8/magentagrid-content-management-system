# Content Management System (CMS) Platform

A full-stack, responsive Content Management System (CMS) built with **React + TypeScript** on the frontend and **Node.js/Express + MongoDB** on the backend. Engineered with role-based access control (Admin & Editor), secure JWT authentication via HttpOnly cookies with automatic token refresh, real-time cross-client synchronization using Socket.IO, multi-device preview simulation, and a Feature-Sliced Design (FSD) architecture.

---

## 1. Project Introduction

**Content Management System (CMS) Platform** is a modern, production-grade publishing application designed for content creators and editorial teams.

- **Frontend**: React 19, TypeScript, Tailwind CSS, TanStack Query, React Router, Socket.IO Client, Vite
- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose), JWT, Socket.IO, Zod, Winston
- **Core Functionality**: Enables administrators and editors to manage site settings, build custom pages with block-based sections, stage content in draft mode, publish changes live in real-time, and view multi-device responsive previews.

---

## 2. Project Overview

The CMS Platform separates concern between a public-facing website and an authenticated Admin CMS:

- **What it is**: An end-to-end headless/hybrid content management platform with real-time editorial capabilities.
- **Main Purpose**: Provide a fast, accessible, and structured medium for publishing digital content without technical friction.
- **Role Concept**:
  - **Admin**: Complete system governance including page creation, editing, publishing, unpublishing, deleting, and site branding settings.
  - **Editor**: Content creation and draft editing permissions without administrative publishing or deletion rights.
- **Public Website vs. Admin CMS**:
  - **Public Website**: Renders published dynamic pages, services, hero banners, methodology steps, and testimonials with live updates.
  - **Admin CMS**: A secure management portal featuring drag-and-drop block ordering, image cropping, live canvas previews, and section toggles.

---

## 3. Prerequisites

Ensure your development environment meets the following software requirements before installation:

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/cms`) or a remote MongoDB Atlas connection string

---

## 4. Clone & Install Project

First, clone the repository to your local machine:

```bash
git clone https://github.com/Arun07-8/magentagrid-content-management-system.git
cd magentagrid-content-management-system
```

Install dependencies for both backend and frontend applications:

### Backend Dependencies
```bash
cd backend
npm install
```

### Frontend Dependencies
```bash
cd frontend
npm install
```

---

## 5. Environment Configuration

Configure environment variables before starting the servers.

### Backend `.env`
Create `backend/.env` on your local environment. This file contains your actual local database connection string and secret keys. **This file is excluded from Git via `.gitignore` and must never be committed.**

Documented backend environment variables structure:
```env
PORT=5000
JWT_ACCESS_SECRET=<JWT_ACCESS_SECRET>
JWT_REFRESH_SECRET=<JWT_REFRESH_SECRET>
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL_DAYS=7
MONGODB_URI=<MONGODB_URI>
```

### Backend `.env.example`
The repository includes `backend/.env.example` as a safe configuration template for version control:

```env
PORT=5000
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL_DAYS=7
MONGODB_URI=mongodb://localhost:27017/cms
```

> **Key Distinction**:
> - `backend/.env` → Contains real local database credentials and active secrets (do not commit to Git).
> - `backend/.env.example` → Safe configuration template committed to public version control.

### Frontend `.env`
Create `frontend/.env` to configure the API and WebSocket server URLs:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 6. Admin & Editor Credentials

The application provides default seeded accounts with distinct role capabilities:

### Admin Account
- **Username**: `Admin`
- **Email**: `admingrido@gmail.com`
- **Password**: `admin@123`
- **Allowed Actions**: Full access — View, Create, Edit, Publish, Unpublish, Delete pages and manage site-wide settings.

### Editor Account
- **Username**: `Editor`
- **Email**: `editorgrido@gmail.com`
- **Password**: `editor@123`
- **Allowed Actions**: Limited access — View, Create, and Edit draft content. Cannot Publish, Unpublish, or Delete pages.

> ⚠️ **Security Warning**: When committing code to a public GitHub repository, ensure real production credentials or production database URIs are never exposed in public documentation.

---

## 7. CLI User Creation

As an alternative to default seeded credentials, developers can create custom Admin or Editor users directly from the command line:

```bash
cd backend

# Create a custom Admin user
npm run create:admin

# Create a custom Editor user
npm run create:editor
```

### CLI Workflow & Verification:
- **Interactive Prompts**: Requests Username, Email, and Password.
- **Masked Input**: Password typing is masked in the terminal for security.
- **Validation**: Enforces non-empty values, valid email syntax, and minimum 6-character passwords.
- **Duplicate Prevention**: Checks MongoDB for existing usernames or email addresses.
- **Password Hashing**: Automatically hashes passwords via `bcryptjs` before database insertion.

---

## 8. Run the Application

Both backend and frontend servers must be run simultaneously.

### Step 1: Start Backend Server
```bash
cd backend
npm run dev
```
- **Backend Service**: `http://localhost:5000`
- **Health Check Endpoint**: `http://localhost:5000/api/health`

### Step 2: Start Frontend Server
Open a second terminal window:
```bash
cd frontend
npm run dev
```
- **Frontend Application**: `http://localhost:5173`

---

## 9. Login & First Use

Follow this step-by-step walkthrough for evaluating the application:

1. Launch backend server (`cd backend && npm run dev`).
2. Launch frontend server (`cd frontend && npm run dev`).
3. Open `http://localhost:5173` in your browser to view the public website.
4. Navigate to the Admin Login page at `http://localhost:5173/admin/login`.
5. Log in using Admin credentials (`admingrido@gmail.com` / `admin@123`) or Editor credentials (`editorgrido@gmail.com` / `editor@123`).
6. Access the CMS dashboard to manage pages, edit section content, toggle device preview modes, or test real-time Socket.IO broadcasts.

---

## 10. Main Features

### Public Website
- **Home Page (`/`)**: Dynamic hero section, service items, why choose us features, process steps, reader testimonials, and contact block.
- **About Page (`/about`)**: Detailed editorial philosophy, studio pillars, capabilities, mission/vision, and guiding principles.
- **Services (`/services`)**: Capabilities overview with smooth anchor navigation.
- **Contact (`/contact`)**: Editorial desk details, operating hours, and inquiry form.
- **Dynamic Custom Pages (`/page/:slug`)**: Custom user-created pages with configurable section orders.
- **404 Fallback (`*`)**: Configurable Not Found page.

### Admin CMS Portal
- **Page Management Dashboard (`/admin/pages`)**: Overview of all system and custom pages with status indicators (Published / Draft).
- **Block-Level Editor (`/admin/pages/edit/:slug`)**: Granular editing of text, links, badge text, and image URLs with client-side cropping.
- **Responsive Simulator Preview (`/admin/pages/preview/:slug`)**: Multi-device toggle for **Desktop (~1280px)**, **Tablet (~768px)**, and **Mobile (~390px)**.
- **Draft & Publish Lifecycle**: Staging environment allowing draft editing before pushing updates to the live site.

### Authentication & Security
- **Dual JWT + HttpOnly Cookie Flow**: Short-lived access tokens (`15m`) and refresh tokens (`7d`) stored in HttpOnly cookies.
- **Automatic Token Refresh**: Seamless session renewal on access token expiration without logging out.
- **Role-Based Guards**: Backend middleware (`requireRole('admin')`) preventing non-admin accounts from executing protected actions.

### Real-Time Synchronization
- Socket.IO event broadcasting (`pages:changed`, `settings:changed`) invalidating TanStack Query caches across open clients instantly.

---

## 11. Architecture & Project Structure

### Backend Architecture: Modular Monolith
```text
backend/
├── src/
│   ├── cli/                   # User creation CLI entrypoints
│   ├── config/                # DB, Environment (Zod), and Socket.IO configuration
│   ├── middleware/            # Auth, Role, Validation, Upload, and Error handling
│   ├── modules/
│   │   ├── auth/              # Auth controller, service, routes, user model
│   │   ├── pages/             # Page controller, service, routes, page model
│   │   └── settings/          # Site settings controller, service, routes
│   ├── utils/                 # Logger (Winston)
│   ├── app.ts                 # Express application & CORS configuration
│   └── server.ts              # HTTP server & Socket.IO server startup
```

### Frontend Architecture: Feature-Sliced Design (FSD)
```text
frontend/
├── src/
│   ├── app/                   # Root providers, context, router
│   │   ├── context/           # AuthContext (React Context API session state)
│   │   ├── providers/         # QueryProvider & ToastProvider
│   │   └── router/            # AppRoutes & ProtectedRoute
│   ├── pages/                 # Public & Admin view pages
│   ├── widgets/               # Layout components (Navbar, Footer, AdminSidebar, AdminHeader)
│   ├── features/              # Use-case modules (auth/LoginForm, useAuth)
│   ├── entities/              # Business entities (user session via React Context API, page, settings)
│   └── shared/                # Primitives, API client interceptor, UI components
```

> **Note**: State management is handled cleanly via the **React Context API** and **TanStack Query**. No third-party state libraries like Zustand are used.

---

## 12. Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Routing**: React Router DOM v7
- **Server State Management**: TanStack Query (React Query) v5
- **Client Session State**: React Context API
- **Styling**: Tailwind CSS v4
- **Real-Time Communication**: Socket.IO Client v4
- **Icons**: Lucide React
- **Build Tool**: Vite v8

### Backend
- **Runtime**: Node.js + Express 5
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose 9
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Cookie Parsing**: cookie-parser (HttpOnly cookies)
- **Real-Time Engine**: Socket.IO v4
- **Validation**: Zod 4
- **Logging**: Winston
- **Runner**: tsx (TypeScript execute)

---

## 13. Testing

- **TypeScript Type Checking**:
  - Backend: `npm run build` (`tsc`)
  - Frontend: `npm run build` (`tsc -b && vite build`)
- **Linting & Formatting**: `npm run lint` (ESLint on frontend)
- **API Endpoint Verification**: `/api/health` status check endpoint for backend liveness checks.

---

## 14. AI Assistance Disclosure

AI assistance was used only for:

- Research and understanding of CMS platform concepts and implementation approaches.
- Investigating and resolving small development errors and issues during development.

AI was not used to generate the core application architecture or major application features.

---

## 15. Assumptions / Notes

1. **Environment Requirements**: Requires Node.js 18+ and a accessible MongoDB instance (local or MongoDB Atlas).
2. **Session Persistence**: Authentication relies on HttpOnly cookies (`cms_token`, `cms_refresh_token`) requiring `credentials: 'include'` on client fetch calls.
3. **Database Defaults**: Default system pages (`home`, `about`, `404`) and site settings are auto-seeded on first server boot if database collections are empty.
4. **Credential Security**: Production database URI and secrets should remain strictly inside local `backend/.env` files and never committed to public repositories.