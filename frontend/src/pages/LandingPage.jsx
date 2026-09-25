import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseAPI } from '../services/api';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  CheckCircle2,
  Users,
  Star,
  Clock,
  ShieldCheck,
  Zap,
  PlayCircle,
  FileCheck
} from 'lucide-react';

export default function LandingPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, catRes] = await Promise.all([
          courseAPI.getCourses({ limit: 6 }),
          courseAPI.getCategories()
        ]);
        if (cRes.success) setCourses(cRes.courses);
        if (catRes.success) setCategories(catRes.categories);
      } catch (err) {
        console.error('Error fetching landing data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 sm:pb-24 max-w-full overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-12 pb-16 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32">
        {/* Background glow effects */}
        <div className="absolute -top-40 -left-40 w-80 sm:w-96 h-80 sm:h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-40 w-80 sm:w-96 h-80 sm:h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">100% Free EdTech Platform for College Students</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Learn Skills.{' '}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  Build Your Future.
                </span>{' '}
                Get Certified.
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Access practical courses, build real skills, and earn certificates to showcase your learning — completely free.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/courses"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 hover:scale-105 transition-all flex items-center justify-center gap-2 min-h-[48px]"
                >
                  Explore Courses
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-base transition-all flex items-center justify-center gap-2 min-h-[48px]"
                >
                  Start Learning Free
                </Link>
              </div>

              {/* Platform metrics */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-xl sm:text-3xl font-extrabold text-white">100%</p>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-medium">Free Access</p>
                </div>
                <div>
                  <p className="text-xl sm:text-3xl font-extrabold text-blue-400">10+</p>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-medium">Tech Domains</p>
                </div>
                <div>
                  <p className="text-xl sm:text-3xl font-extrabold text-emerald-400">Instant</p>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-medium">Verifiable Certs</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-30 blur-xl" />
                <div className="relative rounded-3xl bg-slate-800/90 border border-slate-700 p-5 sm:p-6 space-y-5 sm:space-y-6 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">Full-Stack React & Node</h4>
                        <p className="text-[11px] text-slate-400 truncate">4,200+ Enrolled Students</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold shrink-0">
                      FREE
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-300 font-medium">
                      <span>Learning Progress</span>
                      <span className="text-blue-400 font-bold">78%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-[78%]" />
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <Award className="w-6 h-6 text-amber-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">Certificate Ready</p>
                        <p className="text-[10px] text-slate-400 truncate">ID: LF-PY-2026-000124</p>
                      </div>
                    </div>
                    <Link to="/verify/LF-PY-2026-000124" className="text-xs text-indigo-400 font-bold hover:underline shrink-0">
                      Verify &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10 sm:mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest px-3 py-1 bg-blue-50 rounded-full">
            EXPLORE DOMAINS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">Popular Learning Categories</h2>
          <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm">
            Structured learning paths designed for in-demand tech roles and career preparation.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {categories.slice(0, 10).map((cat) => (
            <Link
              key={cat.id}
              to={`/courses?category=${cat.slug}`}
              className="group p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 text-center space-y-2.5 sm:space-y-3"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 flex items-center justify-center transition-all">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  {cat.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 line-clamp-2">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED COURSES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest px-3 py-1 bg-indigo-50 rounded-full">
              CURATED COURSES
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2">Featured Free Courses</h2>
          </div>
          <Link
            to="/courses"
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group shrink-0"
          >
            View All Courses <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {courses.slice(0, 6).map((course) => (
            <div
              key={course.id}
              className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-md">
                    FREE
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-700">
                    {course.difficulty}
                  </div>
                </div>

                <div className="px-5 sm:px-6 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{course.duration}</span>
                    <span>•</span>
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    <span className="font-bold text-slate-700">{course.rating}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {course.short_description}
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between mt-4 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={course.instructor_avatar}
                    alt={course.instructor_name}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <span className="text-xs font-semibold text-slate-700 truncate">{course.instructor_name}</span>
                </div>

                <Link
                  to={`/courses/${course.slug || course.id}`}
                  className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-xs transition-all shrink-0"
                >
                  View Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW LEARNFREE WORKS */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
              SIMPLE 3-STEP FLOW
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">How LearnFree Works</h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Start building verified tech credentials in three straightforward steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-lg">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Choose a Course</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Browse our free catalog of programming, cloud, AI, and cybersecurity courses tailored for modern tech requirements.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-indigo-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Learn & Pass Quiz</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Watch video tutorials, read comprehensive guides, complete interactive lessons, and score 70%+ on the end-of-course quiz.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-lg">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Earn & Share Certificate</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Receive an instant digital certificate with a unique verification code that employers and universities can verify publicly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CERTIFICATE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 lg:p-14 text-white border border-slate-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
              VERIFIABLE CREDENTIALS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
              Earn Industry-Grade Digital Certificates
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Every course completion on LearnFree awards a verifiable digital certificate. Share your achievements on LinkedIn, resumes, or portfolio sites.
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
              <li className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Unique Verification ID (e.g. `LF-PY-2026-000124`)</span>
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Public Verification URL for employer verification</span>
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Downloadable PDF and printable format</span>
              </li>
            </ul>

            <Link
              to="/verify"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all"
            >
              Verify Sample Certificate
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white text-slate-900 rounded-2xl p-5 sm:p-8 shadow-2xl border-4 border-amber-400/40 space-y-5 relative overflow-hidden">
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-base sm:text-lg text-slate-900">LearnFree</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    VERIFIED
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">ID: LF-PY-2026-000124</p>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-slate-500">Certificate of Completion</p>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900">Alex Johnson</h3>
                <p className="text-xs text-slate-600">has successfully completed all required modules for</p>
                <p className="text-sm sm:text-base font-bold text-blue-600">Python Programming Essentials 2026</p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
                <div>
                  <p className="font-bold text-slate-800">LearnFree Academic Council</p>
                  <p className="text-[10px]">Issued Sep 2026</p>
                </div>
                <Award className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500 shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-14 text-center text-white space-y-6 shadow-xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold max-w-2xl mx-auto">
            Ready to Elevate Your Tech Career for Free?
          </h2>
          <p className="text-indigo-100 text-xs sm:text-base max-w-xl mx-auto">
            Join thousands of college students building real-world skills today. No credit card required.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-600 hover:bg-slate-100 font-extrabold text-sm sm:text-base shadow-lg transition-all hover:scale-105"
            >
              Get Started Free Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
