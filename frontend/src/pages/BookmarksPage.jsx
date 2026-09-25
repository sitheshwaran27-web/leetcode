import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookmarkAPI } from '../services/api';
import { useToast } from '../components/common/Toast';
import { Bookmark, Star, Clock, BookOpen, Trash2 } from 'lucide-react';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const res = await bookmarkAPI.getBookmarks();
        if (res.success) {
          setBookmarks(res.bookmarks || []);
        }
      } catch (err) {
        toast.error('Failed to load bookmarked courses');
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const handleRemove = async (courseId) => {
    try {
      const res = await bookmarkAPI.removeBookmark(courseId);
      if (res.success) {
        setBookmarks((prev) => prev.filter((b) => b.id !== courseId));
        toast.success('Bookmark removed');
      }
    } catch (err) {
      toast.error('Failed to remove bookmark');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-amber-500 fill-amber-500" />
          <h1 className="text-3xl font-extrabold text-slate-900">My Bookmarked Courses</h1>
        </div>
        <p className="text-xs text-slate-500">Quickly access courses you've saved for later study.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-64 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center space-y-3 border border-slate-200 max-w-md mx-auto">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-800">No bookmarked courses yet</p>
          <p className="text-xs text-slate-500">Save courses to your bookmarks list as you browse!</p>
          <Link to="/courses" className="inline-block px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md">
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemove(course.id)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 text-rose-400 hover:text-rose-300 backdrop-blur-md"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="px-5 space-y-2">
                  <h3 className="text-base font-bold text-slate-900 line-clamp-2">{course.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{course.short_description}</p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-100 mt-4">
                <Link
                  to={`/courses/${course.slug || course.id}`}
                  className="block w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center shadow-md"
                >
                  View Course Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
