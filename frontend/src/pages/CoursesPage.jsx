import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { courseAPI } from '../services/api';
import {
  Search,
  Filter,
  Star,
  Clock,
  BookOpen,
  Award,
  SlidersHorizontal,
  X,
  ChevronDown
} from 'lucide-react';

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'popular');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await courseAPI.getCategories();
        if (res.success) setCategories(res.categories);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = {
          search,
          category,
          difficulty,
          sort
        };
        const res = await courseAPI.getCourses(params);
        if (res.success) {
          setCourses(res.courses);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [search, category, difficulty, sort]);

  const handleClearFilters = () => {
    setSearch('');
    setCategory('all');
    setDifficulty('all');
    setSort('popular');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider px-3 py-1 bg-blue-50 rounded-full">
          CATALOG
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Explore Free Courses</h1>
        <p className="text-slate-600 text-sm max-w-2xl">
          High-yield educational courses designed for computer science and tech students. Learn at your own pace and earn certificates.
        </p>
      </div>

      {/* Filter & Search Bar Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="md:col-span-5 relative">
            <input
              type="text"
              placeholder="Search courses by title, skill, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Selector */}
          <div className="md:col-span-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Selector */}
          <div className="md:col-span-2">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Active Filters Bar */}
        {(search || category !== 'all' || difficulty !== 'all') && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Active filters:</span>
            {search && (
              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                "{search}"
              </span>
            )}
            {category !== 'all' && (
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                Category: {category}
              </span>
            )}
            {difficulty !== 'all' && (
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                Level: {difficulty}
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-xs text-rose-600 font-bold hover:underline ml-auto"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 bg-slate-200/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200 max-w-lg mx-auto">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No courses match your criteria</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search terms or clearing the category and difficulty filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-lg"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
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

                <div className="px-5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[11px]">
                      {course.category?.name || 'Technology'}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-slate-700">{course.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {course.short_description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" /> {course.lesson_count || 4} Lessons
                    </span>
                    {course.certificate_enabled && (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <Award className="w-3.5 h-3.5" /> Certificate
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <img
                    src={course.instructor_avatar}
                    alt={course.instructor_name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs font-medium text-slate-700">{course.instructor_name}</span>
                </div>

                <Link
                  to={`/courses/${course.slug || course.id}`}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 font-bold text-xs shadow-md transition-all"
                >
                  View Course
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
