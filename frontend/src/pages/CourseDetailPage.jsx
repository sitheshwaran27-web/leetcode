import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseAPI, enrollmentAPI, bookmarkAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import {
  BookOpen,
  Clock,
  Star,
  Award,
  CheckCircle2,
  Bookmark,
  PlayCircle,
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  FileText
} from 'lucide-react';

export default function CourseDetailPage() {
  const { identifier } = useParams();
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const res = await courseAPI.getBySlug(identifier);
        if (res.success && res.course) {
          setCourse(res.course);
          setLessons(res.course.lessons || []);

          if (isAuthenticated) {
            // Check enrollment status
            const enrollRes = await enrollmentAPI.getCourseDetails(res.course.id);
            if (enrollRes.success) {
              setEnrolled(enrollRes.enrolled);
            }

            // Check bookmark status
            const bmRes = await bookmarkAPI.getBookmarks();
            if (bmRes.success) {
              const isBm = bmRes.bookmarks.some((b) => b.id === res.course.id);
              setBookmarked(isBm);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching course details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [identifier, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in or create a free account to enroll.');
      navigate(`/login?redirect=/courses/${identifier}`);
      return;
    }

    setEnrolling(true);
    try {
      const res = await enrollmentAPI.enroll(course.id);
      if (res.success) {
        setEnrolled(true);
        toast.success(`Successfully enrolled in ${course.title}!`);
        navigate(`/learn/${course.id}`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to save bookmarked courses.');
      return;
    }

    try {
      const res = await bookmarkAPI.toggleBookmark(course.id);
      if (res.success) {
        setBookmarked(res.bookmarked);
        toast.success(res.bookmarked ? 'Added to bookmarked courses!' : 'Bookmark removed.');
      }
    } catch (err) {
      toast.error('Failed to update bookmark');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-8 animate-pulse">
        <div className="h-64 bg-slate-200 rounded-3xl" />
        <div className="h-32 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <BookOpen className="w-16 h-16 text-slate-400 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Course Not Found</h2>
        <p className="text-sm text-slate-500">The requested course could not be located in our database.</p>
        <Link to="/courses" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs">
          Browse All Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header Banner */}
      <section className="bg-slate-950 text-white pt-12 pb-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Course info */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">
                  {course.category?.name || 'Computer Science'}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                  {course.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black">
                  100% FREE
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                {course.description}
              </p>

              {/* Course Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-2 font-medium">
                <div className="flex items-center gap-2">
                  <img
                    src={course.instructor_avatar}
                    alt={course.instructor_name}
                    className="w-8 h-8 rounded-full border border-indigo-400"
                  />
                  <span>Created by <strong className="text-white">{course.instructor_name}</strong></span>
                </div>

                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-white">{course.rating}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{course.duration}</span>
                </div>

                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>{lessons.length} Lessons</span>
                </div>
              </div>
            </div>

            {/* Right Course Card CTA */}
            <div className="lg:col-span-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-800">
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-3">
                  {enrolled ? (
                    <Link
                      to={`/learn/${course.id}`}
                      className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all"
                    >
                      <PlayCircle className="w-5 h-5" /> Continue Learning
                    </Link>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll Free Now'}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}

                  <button
                    onClick={handleToggleBookmark}
                    className={`w-full py-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      bookmarked
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-amber-400' : ''}`} />
                    {bookmarked ? 'Bookmarked' : 'Bookmark Course'}
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Full lifetime free access
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Video lessons & downloadable resources
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Interactive evaluation quiz
                  </div>
                  {course.certificate_enabled && (
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-400" /> Verifiable digital certificate
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* What You'll Learn */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900">What You'll Learn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Master core concept architecture and best practice workflows',
                'Write production-ready code with modern tools and frameworks',
                'Understand industry standards, debugging, and optimization',
                'Earn an official verifiable certificate of completion'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700 font-medium leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum & Lessons List */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Course Curriculum</h2>
                <p className="text-xs text-slate-500 mt-1">{lessons.length} Lessons • {course.duration} Total Length</p>
              </div>
            </div>

            <div className="space-y-3">
              {lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{lesson.title}</h4>
                      <p className="text-xs text-slate-500">{lesson.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500">{lesson.duration || '15 min'}</span>
                    {enrolled ? (
                      <PlayCircle className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificate Info */}
          {course.certificate_enabled && (
            <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-3xl p-8 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-amber-400" />
                <div>
                  <h3 className="text-lg font-bold text-white">Earn a Verified LearnFree Certificate</h3>
                  <p className="text-xs text-slate-300">
                    Complete all lessons and achieve 70%+ on the final quiz to unlock your credential.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Instructor Details</h3>
            <div className="flex items-center gap-3">
              <img
                src={course.instructor_avatar}
                alt={course.instructor_name}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{course.instructor_name}</h4>
                <p className="text-xs text-slate-500">Lead Educator & Industry Expert</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Experienced software engineering mentor dedicated to making high-quality tech education accessible to every student for free.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
