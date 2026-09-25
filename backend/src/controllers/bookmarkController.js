import { getStore } from '../services/dbStore.js';
import crypto from 'crypto';

export const toggleBookmark = async (req, res) => {
  try {
    const { id: course_id } = req.params;
    const student_id = req.user.id;
    const { memDb } = getStore();

    const existingIndex = memDb.bookmarks.findIndex(
      (b) => b.student_id === student_id && b.course_id === course_id
    );

    if (existingIndex !== -1) {
      memDb.bookmarks.splice(existingIndex, 1);
      return res.json({ success: true, bookmarked: false, message: 'Bookmark removed.' });
    } else {
      const newBookmark = {
        id: crypto.randomUUID(),
        student_id,
        course_id,
        created_at: new Date().toISOString()
      };
      memDb.bookmarks.push(newBookmark);
      return res.json({ success: true, bookmarked: true, message: 'Course bookmarked!' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getMyBookmarks = async (req, res) => {
  try {
    const student_id = req.user.id;
    const { memDb } = getStore();

    const userBookmarks = memDb.bookmarks.filter((b) => b.student_id === student_id);
    const bookmarkedCourses = userBookmarks
      .map((b) => {
        const course = memDb.courses.find((c) => c.id === b.course_id);
        if (!course) return null;
        const category = memDb.categories.find((cat) => cat.id === course.category_id);
        return {
          ...course,
          category,
          bookmarked_at: b.created_at
        };
      })
      .filter(Boolean);

    res.json({ success: true, count: bookmarkedCourses.length, bookmarks: bookmarkedCourses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
