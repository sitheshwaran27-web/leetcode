import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  Search,
  Menu,
  X,
  User,
  LayoutDashboard,
  Award,
  Bookmark,
  LogOut,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Verify Certificate', path: '/verify' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
              LearnFree
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-indigo-400 ml-1.5 px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
              EdTech
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-blue-400 bg-slate-800/80'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Search Input */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search free courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/90 border border-slate-700/80 text-white placeholder-slate-400 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        </form>

        {/* Right User Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User Profile Menu"
                className="flex items-center gap-2.5 p-1.5 pl-3 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-slate-600 transition-all"
              >
                <img
                  src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                  alt={user?.full_name}
                  className="w-7 h-7 rounded-full object-cover border border-indigo-400/40"
                />
                <span className="text-xs font-semibold text-slate-200 max-w-[120px] truncate">
                  {user?.full_name?.split(' ')[0]}
                </span>
                {isAdmin && (
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                    ADMIN
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-slate-200 divide-y divide-slate-700/50"
                >
                  <div className="px-4 py-2.5">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium hover:bg-slate-700/50 text-slate-200 hover:text-white"
                    >
                      <LayoutDashboard className="w-4 h-4 text-blue-400" />
                      Student Dashboard
                    </Link>

                    <Link
                      to="/bookmarks"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium hover:bg-slate-700/50 text-slate-200 hover:text-white"
                    >
                      <Bookmark className="w-4 h-4 text-amber-400" />
                      Bookmarked Courses
                    </Link>

                    <Link
                      to="/certificates"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium hover:bg-slate-700/50 text-slate-200 hover:text-white"
                    >
                      <Award className="w-4 h-4 text-emerald-400" />
                      My Certificates
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium hover:bg-slate-700/50 text-amber-300 hover:text-amber-200 font-semibold"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        Admin Portal
                      </Link>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation Menu"
          aria-expanded={mobileOpen}
          className="md:hidden p-2 text-slate-300 hover:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearchSubmit} className="relative mt-2">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 text-white placeholder-slate-400 text-sm rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          </form>

          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-400 bg-slate-800 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/60 rounded-xl">
                  <img
                    src={user?.avatar_url}
                    alt={user?.full_name}
                    className="w-9 h-9 rounded-full border border-indigo-400 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-white truncate">{user?.full_name}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20"
                >
                  <LayoutDashboard className="w-4 h-4" /> Student Dashboard
                </Link>

                <Link
                  to="/bookmarks"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20"
                >
                  <Bookmark className="w-4 h-4" /> Bookmarked Courses
                </Link>

                <Link
                  to="/certificates"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                >
                  <Award className="w-4 h-4" /> My Certificates
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30"
                  >
                    <ShieldAlert className="w-4 h-4" /> Admin Portal
                  </Link>
                )}

                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-3 text-sm font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
