import { getStore } from '../services/dbStore.js';
import crypto from 'crypto';

export const getCategories = async (req, res) => {
  try {
    const { isLive, supabase, memDb } = getStore();
    if (isLive) {
      const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
      if (!error && data) return res.json({ success: true, categories: data });
    }
    res.json({ success: true, categories: memDb.categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getCourses = async (req, res) => {
  try {
    const { search, category, difficulty, sort = 'popular', page = 1, limit = 12 } = req.query;
    const { isLive, supabase, memDb } = getStore();

    let coursesList = [];

    if (isLive) {
      let query = supabase.from('courses').select('*, categories(*)').eq('published', true);

      if (category && category !== 'all') {
        query = query.eq('category_id', category);
      }
      if (difficulty && difficulty !== 'all') {
        query = query.eq('difficulty', difficulty);
      }

      const { data, error } = await query;
      if (!error && data) {
        coursesList = data;
      } else {
        coursesList = memDb.courses;
      }
    } else {
      coursesList = [...memDb.courses.filter((c) => c.published)];
    }

    // Filter by Category
    if (category && category !== 'all') {
      coursesList = coursesList.filter((c) => c.category_id === category || c.category?.slug === category);
    }

    // Filter by Difficulty
    if (difficulty && difficulty !== 'all') {
      coursesList = coursesList.filter((c) => c.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    // Search Query (title, description, category name)
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      coursesList = coursesList.filter((c) => {
        const cat = memDb.categories.find((cat) => cat.id === c.category_id);
        const catName = cat ? cat.name.toLowerCase() : '';
        return (
          c.title.toLowerCase().includes(q) ||
          c.short_description.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          catName.includes(q)
        );
      });
    }

    // Sorting
    if (sort === 'popular') {
      coursesList.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'rating') {
      coursesList.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'newest') {
      coursesList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    // Attach Category Object and Lesson Count to each course
    const enrichedCourses = coursesList.map((course) => {
      const cat = memDb.categories.find((cat) => cat.id === course.category_id) || course.categories || {};
      const courseLessons = memDb.lessons.filter((l) => l.course_id === course.id);
      return {
        ...course,
        category: cat,
        lesson_count: courseLessons.length || 4
      };
    });

    res.json({
      success: true,
      count: enrichedCourses.length,
      courses: enrichedCourses
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getCourseBySlugOrId = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { memDb } = getStore();

    const course = memDb.courses.find(
      (c) => c.slug === identifier || c.id === identifier
    );

    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found.' });
    }

    const category = memDb.categories.find((cat) => cat.id === course.category_id) || {};
    const lessons = memDb.lessons
      .filter((l) => l.course_id === course.id)
      .sort((a, b) => a.lesson_order - b.lesson_order);
    const quiz = memDb.quizzes.find((q) => q.course_id === course.id) || null;

    res.json({
      success: true,
      course: {
        ...course,
        category,
        lessons,
        quiz,
        lesson_count: lessons.length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, short_description, category_id, difficulty, duration, thumbnail_url, certificate_enabled } = req.body;
    const { memDb } = getStore();

    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required.' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newCourse = {
      id: crypto.randomUUID(),
      title,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      description,
      short_description: short_description || description.slice(0, 120),
      thumbnail_url: thumbnail_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
      category_id: category_id || memDb.categories[0].id,
      difficulty: difficulty || 'Beginner',
      duration: duration || '3 hours',
      instructor_name: req.user.full_name || 'LearnFree Admin',
      instructor_avatar: req.user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      rating: 5.0,
      certificate_enabled: certificate_enabled !== false,
      published: true,
      created_at: new Date().toISOString()
    };

    memDb.courses.unshift(newCourse);
    res.status(201).json({ success: true, course: newCourse });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { memDb } = getStore();

    const index = memDb.courses.findIndex((c) => c.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Course not found.' });
    }

    memDb.courses[index] = {
      ...memDb.courses[index],
      ...req.body,
      updated_at: new Date().toISOString()
    };

    res.json({ success: true, course: memDb.courses[index] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { memDb } = getStore();

    memDb.courses = memDb.courses.filter((c) => c.id !== id);
    res.json({ success: true, message: 'Course deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
