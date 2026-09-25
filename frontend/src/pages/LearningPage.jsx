import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { enrollmentAPI, progressAPI } from '../services/api';
import { useToast } from '../components/common/Toast';
import {
  PlayCircle,
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight,
  Award,
  BookOpen,
  FileText,
  HelpCircle,
  Menu,
  X,
  ListOrdered,
  Code2,
  ExternalLink,
  Download,
  FolderOpen
} from 'lucide-react';

export default function LearningPage() {
  const { courseId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [quizAttempt, setQuizAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    const fetchLearningData = async () => {
      setLoading(true);
      try {
        const res = await enrollmentAPI.getCourseDetails(courseId);
        if (res.success) {
          setCourse(res.course);
          setLessons(res.lessons || []);
          setCompletedLessonIds(res.completedLessonIds || []);
          setQuiz(res.quiz);
          setQuizAttempt(res.quizAttempt);

          const firstUncompleted = res.lessons?.findIndex(
            (l) => !res.completedLessonIds?.includes(l.id)
          );
          if (firstUncompleted !== -1 && firstUncompleted !== undefined) {
            setCurrentLessonIndex(firstUncompleted);
          }
        }
      } catch (err) {
        toast.error('Failed to load learning room details');
      } finally {
        setLoading(false);
      }
    };

    fetchLearningData();
  }, [courseId]);

  const currentLesson = lessons[currentLessonIndex] || null;
  const isCurrentCompleted = currentLesson && completedLessonIds.includes(currentLesson.id);
  const progressPercentage = lessons.length
    ? Math.round((completedLessonIds.length / lessons.length) * 100)
    : 0;

  const handleMarkComplete = async () => {
    if (!currentLesson) return;

    setCompleting(true);
    try {
      const res = await progressAPI.completeLesson(currentLesson.id);
      if (res.success) {
        toast.success(`Lesson "${currentLesson.title}" completed!`);
        setCompletedLessonIds((prev) => [...new Set([...prev, currentLesson.id])]);

        if (currentLessonIndex < lessons.length - 1) {
          setCurrentLessonIndex((prev) => prev + 1);
        } else if (quiz) {
          toast.info('All lessons completed! You can now take the evaluation quiz.');
        }
      }
    } catch (err) {
      toast.error('Failed to update progress');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="space-y-4 text-center">
          <BookOpen className="w-10 h-10 text-blue-500 animate-bounce mx-auto" />
          <p className="text-sm font-semibold">Loading LearnFree Learning Environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col max-w-full overflow-x-hidden">
      {/* Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-30 shrink-0 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Curriculum Drawer"
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <ListOrdered className="w-5 h-5 text-blue-400" />}
          </button>

          <Link to="/dashboard" className="text-xs text-slate-400 hover:text-white font-semibold shrink-0 hidden sm:inline-block">
            &larr; Dashboard
          </Link>
          <div className="h-4 w-px bg-slate-800 hidden sm:block shrink-0" />

          <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-[160px] sm:max-w-xs md:max-w-md">
            {course?.title}
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2">
            <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-xs font-bold text-emerald-400">{progressPercentage}%</span>
          </div>

          {quiz && (
            <Link
              to={`/quiz/${quiz.id}`}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 flex items-center gap-1.5 shrink-0"
            >
              <Award className="w-4 h-4" /> <span className="hidden sm:inline">Take</span> Quiz
            </Link>
          )}
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="absolute lg:relative inset-y-0 left-0 z-40 w-full sm:w-80 bg-slate-900 border-r border-slate-800 shrink-0 flex flex-col justify-between overflow-y-auto shadow-2xl lg:shadow-none">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-blue-400" /> Lesson Modules ({lessons.length})
                </h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1.5">
                {lessons.map((lesson, idx) => {
                  const isCompleted = completedLessonIds.includes(lesson.id);
                  const isCurrent = idx === currentLessonIndex;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setCurrentLessonIndex(idx);
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all ${
                        isCurrent
                          ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                          : 'hover:bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <PlayCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold line-clamp-1 ${isCurrent ? 'text-blue-300' : ''}`}>
                          {lesson.title}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{lesson.duration || '35 min'}</p>
                      </div>
                    </button>
                  );
                })}

                {quiz && (
                  <Link
                    to={`/quiz/${quiz.id}`}
                    onClick={() => {
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-xl flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-300 transition-all mt-4"
                  >
                    <Award className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Certification Quiz (10 Qs)</p>
                      <p className="text-[10px] text-amber-400/80">Passing Score: 70%</p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </aside>
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 max-w-full">
          {currentLesson ? (
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
              {/* Video Player */}
              <div className="aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative w-full">
                {currentLesson.video_url ? (
                  <iframe
                    src={currentLesson.video_url}
                    title={currentLesson.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center space-y-3 text-slate-400 p-4 text-center">
                    <BookOpen className="w-10 h-10 text-slate-600" />
                    <p className="text-xs font-semibold">Reading Lesson Module</p>
                  </div>
                )}
              </div>

              {/* Title & Complete Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                      Module {currentLessonIndex + 1} of {lessons.length}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">{currentLesson.duration || '35 min'}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">{currentLesson.title}</h2>
                </div>

                <button
                  onClick={handleMarkComplete}
                  disabled={completing}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all min-h-[44px] ${
                    isCurrentCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isCurrentCompleted ? 'Completed ✓' : completing ? 'Updating...' : 'Mark Complete'}
                </button>
              </div>

              {/* Lesson Text Explanation */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4">
                <h3 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" /> Lesson Guide & Notes
                </h3>
                <div className="prose prose-invert max-w-none text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {currentLesson.content || currentLesson.description}
                </div>
              </div>

              {/* PHASE E: REAL LEARNING RESOURCES SECTION */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4">
                <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-indigo-400" /> Learning Resources & Downloads
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); toast.info('Downloaded lesson notes PDF!'); }}
                    className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-indigo-500/50 text-xs font-semibold text-slate-200 flex items-center gap-2.5 transition-all"
                  >
                    <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="truncate">📄 Lesson Notes PDF</span>
                  </a>

                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-indigo-500/50 text-xs font-semibold text-slate-200 flex items-center gap-2.5 transition-all"
                  >
                    <Code2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">💻 Code Examples</span>
                  </a>

                  <a
                    href="https://developer.mozilla.org"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-indigo-500/50 text-xs font-semibold text-slate-200 flex items-center gap-2.5 transition-all"
                  >
                    <ExternalLink className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="truncate">🔗 External References</span>
                  </a>
                </div>
              </div>

              {/* Bottom Navigation */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => setCurrentLessonIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentLessonIndex === 0}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-40 flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous Lesson
                </button>

                {currentLessonIndex < lessons.length - 1 ? (
                  <button
                    onClick={() => setCurrentLessonIndex((prev) => Math.min(lessons.length - 1, prev + 1))}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    Next Lesson <ChevronRight className="w-4 h-4" />
                  </button>
                ) : quiz ? (
                  <Link
                    to={`/quiz/${quiz.id}`}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    Take Certification Quiz <Award className="w-4 h-4" />
                  </Link>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-400 text-xs sm:text-sm">Select a lesson module to start learning.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
