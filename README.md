# LearnFree — Production EdTech SaaS Platform

> **Tagline:** *"Learn Skills. Build Your Future. Get Certified."*

LearnFree is a full-stack, free online learning platform designed specifically for college students. It provides access to high-yield technology courses, interactive lessons, self-evaluation quizzes, and verifiable digital certificates.

---

## 🌟 Features Overview

### 🎓 For Students
- **Authentication & Roles:** Functioning Supabase Auth + JWT fallback with Student vs. Admin role separation.
- **Course Discovery & Filtering:** Real-time multi-criteria filtering by Category (10+ domains), Difficulty level, Duration, Certificate status, and Search.
- **Interactive Learning Room:** Dedicated split-view lesson room with video player, markdown content, curriculum list, completion checkmarks, and dynamic progress bar (0% - 100%).
- **Interactive Quiz System:** Multiple-choice end-of-course quizzes with instant score grading (70% passing score), detailed breakdown, and celebratory confetti upon passing.
- **Verifiable Certificates:** Instant credential generation featuring unique IDs (e.g. `LF-PY-2026-000124`), public verification endpoint (`/verify/:certificateId`), and PDF print/export support.
- **Course Bookmarking:** Database-backed course bookmarking and saved courses dashboard.
- **Personal Student Dashboard:** Real-time metrics counters for Courses Enrolled, Completed, Certificates Earned, and Learning Hours.

### 🛡️ For Administrators
- **Admin Management Portal:** Dedicated dashboard with platform metrics (Total Students, Courses, Enrollments, Completed Courses, Certificates Issued).
- **Course CRUD & Publishing:** Create, update, publish/unpublish, and delete courses.
- **Lesson Management:** Create, reorder, and configure lesson video URLs and markdown guides.
- **Quiz Builder:** Build multiple-choice quizzes with options A-D and custom passing thresholds.
- **Student Roster & Enrollment Logs:** View registered students, completion rates, and platform enrollment logs.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router DOM v7, Axios, Lucide Icons, Canvas Confetti.
- **Backend:** Node.js, Express.js REST API, Helmet security header middleware, CORS, Express Rate Limiter, JWT verification.
- **Database & Auth:** Supabase PostgreSQL + Supabase Auth & Storage (with memory store fallback for standalone testing).

---

## 📁 Project Structure

```
learnfree/
├── frontend/             # React + Vite Frontend Application
│   ├── src/
│   │   ├── components/   # Common Toast & UI components
│   │   ├── context/      # AuthContext & Session state
│   │   ├── layouts/      # MainLayout, AdminLayout, Navbar, Footer
│   │   ├── pages/        # Landing, Courses, Detail, Learning, Quiz, Dashboard, Cert, Admin, etc.
│   │   ├── services/     # Axios API service client
│   │   ├── App.jsx       # React Router setup & protected guards
│   │   ├── main.jsx      # React DOM entry point
│   │   └── index.css     # Tailwind CSS & design system tokens
│   └── vite.config.js
│
├── backend/              # Node.js + Express REST API
│   ├── src/
│   │   ├── config/       # Supabase client setup
│   │   ├── controllers/  # Auth, Course, Enrollment, Progress, Quiz, Cert, Bookmark, Admin
│   │   ├── middleware/   # JWT Authentication & Admin Authorization middleware
│   │   ├── routes/       # Express Router definitions
│   │   ├── services/     # DB service layer & Memory store fallback
│   │   └── server.js     # Express server entry point
│   ├── .env
│   └── package.json
│
├── supabase/
│   ├── migrations/       # SQL Schema definition & RLS policies
│   └── seed.sql          # Seed data (10 categories, 10 courses, lessons, quizzes)
│
├── .env.example          # Environment variables template
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Environment Variables Configuration
Copy `.env.example` to `backend/.env` and `frontend/.env`:

**Backend (`backend/.env`):**
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
JWT_SECRET=learnfree_super_secret_jwt_key_2026
FRONTEND_URL=http://localhost:5173
```

**Frontend (`frontend/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Database Migration (Supabase)
Run the SQL migration files in your Supabase SQL Editor:
1. `supabase/migrations/20260101000000_schema.sql`
2. `supabase/seed.sql`

### 4. Running the Application Locally

**Start Backend Server (Port 5000):**
```bash
cd backend
npm start
```

**Start Frontend Development Server (Port 5173):**
```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔑 Demo Login Credentials

For quick testing, use the one-click demo login buttons on the Login page:

- **Student Account:** `student@learnfree.org` / `student123`
- **Admin Account:** `admin@learnfree.org` / `admin123`
