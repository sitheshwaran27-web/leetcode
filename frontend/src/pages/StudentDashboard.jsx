import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enrollmentAPI, certificateAPI, bookmarkAPI, courseAPI } from '../services/api';
import { useToast } from '../components/common/Toast';
import {
  BookOpen,
  CheckCircle2,
  Award,
  Clock,
  PlayCircle,
  Bookmark,
  ArrowRight,
  Sparkles,
  Bell,
  Star,
  Download,
  ShieldCheck,
  Eye,
  Activity,
  Zap,
  TrendingUp,
  Compass
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [eRes, cRes, bRes, allCoursesRes] = await Promise.all([
          enrollmentAPI.getMyCourses(),
          certificateAPI.getMyCertificates(),
          bookmarkAPI.getBookmarks(),
          courseAPI.getCourses({ limit: 12 })
        ]);

        const userEnrollments = eRes.success ? eRes.enrollments || [] : [];
        const userCerts = cRes.success ? cRes.certificates || [] : [];
        const userBms = bRes.success ? bRes.bookmarks || [] : [];

        setEnrollments(userEnrollments);
        setCertificates(userCerts);
        setBookmarks(userBms);

        // Smart Recommendations: Courses user has NOT enrolled in yet
        if (allCoursesRes.success && allCoursesRes.courses) {
          const enrolledIds = userEnrollments.map((e) => e.course_id);
          const recs = allCoursesRes.courses.filter((c) => !enrolledIds.includes(c.id));
          setRecommended(recs.slice(0, 3));
        }
      } catch (err) {
        console.error('Error loading student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Database-calculated Metrics
  const totalEnrolled = enrollments.length;
  const totalCompleted = enrollments.filter((e) => e.status === 'completed' || e.progress >= 100).length;
  const totalCertificates = certificates.length;
  
  // Calculate total learning hours dynamically
  const learningTimeHours = enrollments.reduce((acc, curr) => {
    const hoursNum = parseFloat(curr.course?.duration || '4') || 4;
    return acc + (hoursNum * (curr.progress / 100));
  }, 0).toFixed(1);

  // Active in-progress course for "Continue Learning" section
  const activeCourse = enrollments.find((e) => e.progress < 100) || enrollments[0] || null;

  const handlePrintCert = (certNum) => {
    navigate(`/verify/${certNum}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8 animate-pulse">
        <div className="h-44 bg-slate-200 rounded-3xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      {/* HEADER WITH GREETING & NOTIFICATION */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
              alt={user?.full_name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-indigo-400/50 shadow-lg shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-3xl font-black">
                  Welcome back, {user?.full_name?.split(' ')[0]} 👋
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                Continue your learning journey and build your skills.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toast.info('You have 2 new system notifications.')}
              className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition-all relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full absolute top-2.5 right-2.5 border-2 border-slate-900" />
            </button>

            <Link
              to="/courses"
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all text-center shrink-0 flex items-center gap-2"
            >
              Explore Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* LEARNING STATISTICS (SUPABASE CALCULATED) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{totalEnrolled}</p>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Courses Enrolled</p>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{totalCompleted}</p>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Courses Completed</p>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{totalCertificates}</p>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Certificates</p>
        </div>

        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{learningTimeHours}h</p>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Learning Time</p>
        </div>
      </div>

      {/* CONTINUE LEARNING SECTION */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-blue-600" /> Continue Learning
        </h2>

        {activeCourse ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                    {activeCourse.course?.category?.name || 'Programming'}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 font-medium">{activeCourse.course?.duration || '8 hours'}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {activeCourse.course?.title}
                </h3>
                
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {activeCourse.course?.short_description}
                </p>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Progress</span>
                    <span className="text-blue-600">{activeCourse.progress}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${activeCourse.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col justify-center items-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 space-y-4">
                <div className="text-right space-y-1 hidden md:block">
                  <p className="text-xs text-slate-500 font-medium">10 Lessons Module</p>
                  <p className="text-xs font-bold text-slate-800">
                    {Math.round((activeCourse.progress / 100) * 10)} / 10 lessons completed
                  </p>
                </div>

                <Link
                  to={`/learn/${activeCourse.course_id}`}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <PlayCircle className="w-5 h-5" /> Continue Learning
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-slate-200">
            <Compass className="w-12 h-12 text-blue-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Start your learning journey</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore our free course catalog and enroll in your first technology course.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
            >
              Explore Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* MY ENROLLED COURSES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">My Courses ({enrollments.length})</h2>
          <Link to="/courses" className="text-xs font-bold text-blue-600 hover:underline">
            View All Catalog &rarr;
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-700">You haven't enrolled in any courses yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((item) => {
              const completedCount = Math.round((item.progress / 100) * 10);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="aspect-video relative overflow-hidden bg-slate-100">
                      <img
                        src={item.course?.thumbnail_url}
                        alt={item.course?.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-md">
                        {item.progress}% Complete
                      </span>
                    </div>

                    <div className="px-5 space-y-2">
                      <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {item.course?.category?.name || 'Technology'}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                        {item.course?.title}
                      </h3>

                      <div className="space-y-1 pt-1">
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 font-semibold">
                          {completedCount} / 10 lessons completed
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-3 border-t border-slate-100 mt-4">
                    <Link
                      to={`/learn/${item.course_id}`}
                      className="block w-full py-2.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white font-bold text-xs text-slate-800 text-center transition-all"
                    >
                      Continue Learning
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2 COLUMNS: RECENT ACTIVITY & CERTIFICATES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* RECENT ACTIVITY FEED */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" /> Recent Learning Activity
          </h2>
          <div className="space-y-3">
            {[
              { icon: CheckCircle2, color: 'text-emerald-500', text: 'Completed "Variables & Data Types"', time: '2 hours ago' },
              { icon: Zap, color: 'text-blue-500', text: 'Enrolled in Web Development Fundamentals', time: '1 day ago' },
              { icon: Award, color: 'text-amber-500', text: 'Earned Python Fundamentals Certificate', time: '2 days ago' },
              { icon: CheckCircle2, color: 'text-emerald-500', text: 'Passed Python Evaluation Quiz (90%)', time: '2 days ago' }
            ].map((act, i) => {
              const IconComp = act.icon;
              return (
                <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 ${act.color} shrink-0`} />
                    <span className="font-semibold text-slate-800">{act.text}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0">{act.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* EARNED CERTIFICATES */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Earned Certificates ({certificates.length})
            </h2>
          </div>

          {certificates.length === 0 ? (
            <div className="p-6 text-center space-y-2 border border-dashed border-slate-200 rounded-2xl">
              <p className="text-xs font-bold text-slate-700">You haven't earned a certificate yet.</p>
              <p className="text-[11px] text-slate-500">Complete all 10 lessons and pass the quiz to earn your first credential.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/5 via-slate-50 to-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-900">{cert.course_title}</p>
                    <p className="text-[10px] font-bold text-amber-600">ID: {cert.certificate_number}</p>
                    <p className="text-[10px] text-slate-400">Issued: {new Date(cert.issued_at).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handlePrintCert(cert.certificate_number)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] hover:bg-amber-400 flex items-center gap-1 shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" /> View / Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RECOMMENDED COURSES */}
      {recommended.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200/80">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" /> Recommended For You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommended.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {c.difficulty}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{c.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{c.short_description}</p>
                </div>

                <Link
                  to={`/courses/${c.slug || c.id}`}
                  className="block w-full py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white text-center font-bold text-xs transition-all"
                >
                  Explore Course
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
