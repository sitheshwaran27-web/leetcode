import { getStore } from '../services/dbStore.js';
import crypto from 'crypto';

export const enrollInCourse = async (req, res) => {
  try {
    const { id: course_id } = req.params;
    const student_id = req.user.id;
    const { memDb } = getStore();

    const course = memDb.courses.find((c) => c.id === course_id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found.' });
    }

    let enrollment = memDb.enrollments.find(
      (e) => e.student_id === student_id && e.course_id === course_id
    );

    if (!enrollment) {
      enrollment = {
        id: crypto.randomUUID(),
        student_id,
        course_id,
        enrolled_at: new Date().toISOString(),
        completed_at: null,
        progress: 0,
        status: 'active'
      };
      memDb.enrollments.push(enrollment);
    }

    res.status(200).json({
      success: true,
      message: `Enrolled successfully in ${course.title}`,
      enrollment
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const student_id = req.user.id;
    const { memDb } = getStore();

    const userEnrollments = memDb.enrollments.filter((e) => e.student_id === student_id);

    const result = userEnrollments.map((enrollment) => {
      const course = memDb.courses.find((c) => c.id === enrollment.course_id);
      const category = memDb.categories.find((cat) => cat.id === course?.category_id);
      const lessons = memDb.lessons.filter((l) => l.course_id === enrollment.course_id);

      // calculate exact progress based on completed lessons
      const completedCount = memDb.lesson_progress.filter(
        (lp) => lp.student_id === student_id && lessons.some((l) => l.id === lp.lesson_id) && lp.completed
      ).length;

      const totalLessons = lessons.length || 1;
      const calculatedProgress = Math.min(100, Math.round((completedCount / totalLessons) * 100));

      return {
        ...enrollment,
        progress: enrollment.status === 'completed' ? 100 : Math.max(enrollment.progress, calculatedProgress),
        course: {
          ...course,
          category,
          lesson_count: lessons.length
        }
      };
    });

    res.json({ success: true, count: result.length, enrollments: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getMyCourseDetails = async (req, res) => {
  try {
    const { id: course_id } = req.params;
    const student_id = req.user.id;
    const { memDb } = getStore();

    const enrollment = memDb.enrollments.find(
      (e) => e.student_id === student_id && e.course_id === course_id
    );

    const course = memDb.courses.find((c) => c.id === course_id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found.' });
    }

    const lessons = memDb.lessons
      .filter((l) => l.course_id === course_id)
      .sort((a, b) => a.lesson_order - b.lesson_order);

    const completedLessonIds = memDb.lesson_progress
      .filter((lp) => lp.student_id === student_id && lp.completed)
      .map((lp) => lp.lesson_id);

    const quiz = memDb.quizzes.find((q) => q.course_id === course_id) || null;
    const quizAttempt = quiz
      ? memDb.quiz_attempts.find((qa) => qa.student_id === student_id && qa.quiz_id === quiz.id)
      : null;

    res.json({
      success: true,
      enrolled: !!enrollment,
      enrollment: enrollment || null,
      course,
      lessons,
      completedLessonIds,
      quiz,
      quizAttempt
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
