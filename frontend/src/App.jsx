import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';

import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import LandingPage from './pages/LandingPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LearningPage from './pages/LearningPage';
import QuizPage from './pages/QuizPage';
import StudentDashboard from './pages/StudentDashboard';
import CertificateViewPage from './pages/CertificateViewPage';
import BookmarksPage from './pages/BookmarksPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

function ProtectedStudentRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public Pages in MainLayout */}
          <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
          <Route path="/courses" element={<MainLayout><CoursesPage /></MainLayout>} />
          <Route path="/courses/:identifier" element={<MainLayout><CourseDetailPage /></MainLayout>} />
          <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
          <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
          <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
          <Route path="/verify" element={<MainLayout><CertificateViewPage /></MainLayout>} />
          <Route path="/verify/:certificateId" element={<MainLayout><CertificateViewPage /></MainLayout>} />

          {/* Student Protected Routes */}
          <Route path="/dashboard" element={<ProtectedStudentRoute><MainLayout><StudentDashboard /></MainLayout></ProtectedStudentRoute>} />
          <Route path="/bookmarks" element={<ProtectedStudentRoute><MainLayout><BookmarksPage /></MainLayout></ProtectedStudentRoute>} />
          <Route path="/certificates" element={<ProtectedStudentRoute><MainLayout><CertificateViewPage /></MainLayout></ProtectedStudentRoute>} />
          <Route path="/learn/:courseId" element={<ProtectedStudentRoute><LearningPage /></ProtectedStudentRoute>} />
          <Route path="/quiz/:quizId" element={<ProtectedStudentRoute><QuizPage /></ProtectedStudentRoute>} />

          {/* Admin Protected Routes */}
          <Route path="/admin/*" element={<ProtectedAdminRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedAdminRoute>} />

          {/* 404 Fallback */}
          <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
