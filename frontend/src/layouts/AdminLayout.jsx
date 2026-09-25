import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Award,
  ArrowLeft,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminNav = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Course Management', path: '/admin/courses', icon: BookOpen },
    { name: 'Student Roster', path: '/admin/students', icon: Users },
    { name: 'Enrollment Logs', path: '/admin/enrollments', icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row max-w-full overflow-x-hidden">
      {/* Sidebar for Desktop / Header Drawer for Mobile */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 shrink-0 flex flex-col justify-between">
        <div>
          {/* Top Bar */}
          <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">Admin Portal</span>
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Admin Menu"
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Nav Items */}
          <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block p-4 space-y-1`}>
            <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Management
            </div>
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Info */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block p-4 border-t border-slate-800 space-y-3`}>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Student App
          </Link>
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt="Admin"
              className="w-8 h-8 rounded-full object-cover border border-amber-500/40 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.full_name}</p>
              <p className="text-[10px] text-amber-400 font-medium uppercase tracking-wider">System Admin</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="text-slate-400 hover:text-rose-400 p-1"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
        {children}
      </main>
    </div>
  );
}
