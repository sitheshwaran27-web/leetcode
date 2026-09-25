import React, { useState, useEffect } from 'react';
import { adminAPI, courseAPI } from '../services/api';
import { useToast } from '../components/common/Toast';
import {
  Users,
  BookOpen,
  GraduationCap,
  Award,
  CheckCircle2,
  Plus,
  Edit,
  Trash2,
  ShieldAlert,
  Search,
  Check,
  X,
  Activity,
  TrendingUp,
  BarChart3,
  ListOrdered,
  Sparkles
} from 'lucide-react';

export default function AdminDashboard() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'courses' | 'students' | 'enrollments' | 'analytics'

  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    short_description: '',
    difficulty: 'Beginner',
    duration: '6 hours',
    thumbnail_url: ''
  });

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [sRes, cRes, stRes, eRes] = await Promise.all([
        adminAPI.getStats(),
        courseAPI.getCourses({ limit: 100 }),
        adminAPI.getStudents(),
        adminAPI.getEnrollments()
      ]);

      if (sRes.success) setStats(sRes.stats);
      if (cRes.success) setCourses(cRes.courses);
      if (stRes.success) setStudents(stRes.students);
      if (eRes.success) setEnrollments(eRes.enrollments);
    } catch (err) {
      toast.error('Failed to load admin management data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.description) {
      toast.error('Title and description are required.');
      return;
    }

    try {
      const res = await courseAPI.createCourse(newCourse);
      if (res.success) {
        toast.success(`Course "${res.course.title}" created & published!`);
        setShowAddCourse(false);
        setNewCourse({
          title: '',
          description: '',
          short_description: '',
          difficulty: 'Beginner',
          duration: '6 hours',
          thumbnail_url: ''
        });
        loadAdminData();
      }
    } catch (err) {
      toast.error('Failed to create course');
    }
  };

  const handleDeleteCourse = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete course "${title}"?`)) return;
    try {
      const res = await courseAPI.deleteCourse(id);
      if (res.success) {
        toast.success(`Course "${title}" deleted.`);
        setCourses((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-slate-800 rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 bg-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              ADMIN CONTROL CENTER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Admin Dashboard</h1>
          <p className="text-xs text-slate-400">Monitor and manage the LearnFree platform.</p>
        </div>

        <button
          onClick={() => setShowAddCourse(true)}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 min-h-[44px]"
        >
          <Plus className="w-4 h-4" /> Create New Course
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-800 space-x-4 text-xs font-bold pb-1">
        {[
          { id: 'overview', label: 'Overview & Stats' },
          { id: 'courses', label: `Manage Courses (${courses.length})` },
          { id: 'students', label: `Registered Students (${students.length})` },
          { id: 'enrollments', label: `Enrollment Logs (${enrollments.length})` },
          { id: 'analytics', label: 'Analytics & Trends' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Modal: Create Course */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-white">Create New Course</h3>
              <button onClick={() => setShowAddCourse(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. Modern React & Web Architecture"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Short Summary</label>
                <input
                  type="text"
                  placeholder="Concise 1-sentence course summary"
                  value={newCourse.short_description}
                  onChange={(e) => setNewCourse({ ...newCourse, short_description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Full Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed course description..."
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Difficulty</label>
                  <select
                    value={newCourse.difficulty}
                    onChange={(e) => setNewCourse({ ...newCourse, difficulty: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 6 hours"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddCourse(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black"
                >
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">{stats?.totalStudents || 0}</p>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Total Students</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">{stats?.totalCourses || 0}</p>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Total Courses</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">{stats?.totalEnrollments || 0}</p>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Total Enrollments</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">{stats?.completedCourses || 0}</p>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Completed Courses</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 col-span-2 lg:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-white">{stats?.certificatesIssued || 0}</p>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Certificates Issued</p>
            </div>
          </div>

          {/* 2 COLUMNS: RECENT ACTIVITY & POPULAR COURSES */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* RECENT ACTIVITY LOG */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" /> Recent Platform Activity
              </h3>
              <div className="space-y-3">
                {[
                  { text: 'Rahul registered as a new student', type: 'user', time: '10 mins ago' },
                  { text: 'Priya enrolled in Python Programming Fundamentals', type: 'enroll', time: '35 mins ago' },
                  { text: 'Alex Johnson completed Web Development Fundamentals', type: 'complete', time: '2 hours ago' },
                  { text: 'Issued Certificate LF-PY-2026-000124 to Alex Johnson', type: 'cert', time: '3 hours ago' }
                ].map((act, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-xs">
                    <span className="text-slate-200 font-medium">{act.text}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* POPULAR COURSES TABLE */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" /> Top Enrolled Courses
              </h3>
              <div className="space-y-3">
                {courses.slice(0, 4).map((c, i) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center">
                        #{i + 1}
                      </span>
                      <span className="font-bold text-white line-clamp-1">{c.title}</span>
                    </div>
                    <span className="text-emerald-400 font-bold text-xs shrink-0">{c.rating} ★</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COURSE MANAGEMENT */}
      {activeTab === 'courses' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 overflow-hidden space-y-4">
          <div className="overflow-x-auto max-w-full">
            <table className="w-full text-left text-xs text-slate-300 min-w-[650px]">
              <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Course Title</th>
                  <th className="p-3.5">Difficulty</th>
                  <th className="p-3.5">Duration</th>
                  <th className="p-3.5">Lessons</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5 font-bold text-white max-w-xs truncate">{c.title}</td>
                    <td className="p-3.5">{c.difficulty}</td>
                    <td className="p-3.5">{c.duration}</td>
                    <td className="p-3.5 font-bold text-blue-400">10 Modules</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                        Published
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleDeleteCourse(c.id, c.title)}
                        className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REGISTERED STUDENTS */}
      {activeTab === 'students' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 overflow-hidden">
          <div className="overflow-x-auto max-w-full">
            <table className="w-full text-left text-xs text-slate-300 min-w-[650px]">
              <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Student Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Enrolled Courses</th>
                  <th className="p-3.5">Completed</th>
                  <th className="p-3.5 rounded-r-xl">Certificates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5 font-bold text-white flex items-center gap-2">
                      <img src={st.avatar_url} alt="" className="w-6 h-6 rounded-full shrink-0" />
                      <span className="truncate">{st.full_name}</span>
                    </td>
                    <td className="p-3.5 text-slate-400 truncate">{st.email}</td>
                    <td className="p-3.5 font-bold text-blue-400">{st.enrolled_courses_count}</td>
                    <td className="p-3.5 font-bold text-emerald-400">{st.completed_courses_count}</td>
                    <td className="p-3.5 font-bold text-amber-400">{st.certificates_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ENROLLMENT LOGS */}
      {activeTab === 'enrollments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 overflow-hidden">
          <div className="overflow-x-auto max-w-full">
            <table className="w-full text-left text-xs text-slate-300 min-w-[650px]">
              <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Student Name</th>
                  <th className="p-3.5">Course Title</th>
                  <th className="p-3.5">Enrolled Date</th>
                  <th className="p-3.5">Progress</th>
                  <th className="p-3.5 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {enrollments.map((en) => (
                  <tr key={en.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5 font-bold text-white truncate">{en.student_name}</td>
                    <td className="p-3.5 max-w-xs truncate">{en.course_title}</td>
                    <td className="p-3.5 text-slate-400 whitespace-nowrap">{new Date(en.enrolled_at).toLocaleDateString()}</td>
                    <td className="p-3.5 font-bold text-blue-400">{en.progress}%</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${en.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {en.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" /> Platform Category Growth & Analytics
          </h3>
          <div className="space-y-4">
            {[
              { cat: 'Programming', percent: 85, count: '320 Students' },
              { cat: 'Web Development', percent: 78, count: '290 Students' },
              { cat: 'Cyber Security', percent: 65, count: '210 Students' },
              { cat: 'Artificial Intelligence', percent: 90, count: '380 Students' },
              { cat: 'Cloud Computing', percent: 60, count: '180 Students' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-slate-300">
                  <span>{item.cat}</span>
                  <span className="text-indigo-400">{item.count} ({item.percent}%)</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
