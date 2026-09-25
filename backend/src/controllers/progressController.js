import { getStore } from '../services/dbStore.js';
import crypto from 'crypto';

export const completeLesson = async (req, res) => {
  try {
    const { id: lesson_id } = req.params;
    const student_id = req.user.id;
    const { memDb } = getStore();

    const lesson = memDb.lessons.find((l) => l.id === lesson_id);
    if (!lesson) {
      return res.status(404).json({ success: false, error: 'Lesson not found.' });
    }

    // Toggle or set completed progress
    let lp = memDb.lesson_progress.find(
      (lp) => lp.student_id === student_id && lp.lesson_id === lesson_id
    );

    if (!lp) {
      lp = {
        id: crypto.randomUUID(),
        student_id,
        lesson_id,
        completed: true,
        completed_at: new Date().toISOString()
      };
      memDb.lesson_progress.push(lp);
    } else {
      lp.completed = true;
      lp.completed_at = new Date().toISOString();
    }

    // Recalculate enrollment progress for this course
    const courseLessons = memDb.lessons.filter((l) => l.course_id === lesson.course_id);
    const completedCount = memDb.lesson_progress.filter(
      (p) => p.student_id === student_id && courseLessons.some((l) => l.id === p.lesson_id) && p.completed
    ).length;

    const progressPercentage = Math.round((completedCount / courseLessons.length) * 100);

    let enrollment = memDb.enrollments.find(
      (e) => e.student_id === student_id && e.course_id === lesson.course_id
    );

    if (enrollment) {
      enrollment.progress = progressPercentage;
      if (progressPercentage >= 100) {
        // Check if quiz exists
        const quiz = memDb.quizzes.find((q) => q.course_id === lesson.course_id);
        const quizAttempt = quiz
          ? memDb.quiz_attempts.find((qa) => qa.student_id === student_id && qa.quiz_id === quiz.id && qa.passed)
          : true;

        if (!quiz || quizAttempt) {
          enrollment.status = 'completed';
          enrollment.completed_at = new Date().toISOString();
        }
      }
    }

    res.json({
      success: true,
      message: 'Lesson marked as complete!',
      progress: progressPercentage,
      completedLessonsCount: completedCount,
      totalLessonsCount: courseLessons.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getCourseProgress = async (req, res) => {
  try {
    const { id: course_id } = req.params;
    const student_id = req.user.id;
    const { memDb } = getStore();

    const lessons = memDb.lessons.filter((l) => l.course_id === course_id);
    const completedLessonIds = memDb.lesson_progress
      .filter((lp) => lp.student_id === student_id && lp.completed && lessons.some((l) => l.id === lp.lesson_id))
      .map((lp) => lp.lesson_id);

    const progressPercentage = lessons.length
      ? Math.round((completedLessonIds.length / lessons.length) * 100)
      : 0;

    res.json({
      success: true,
      progress: progressPercentage,
      completedLessonIds,
      totalLessons: lessons.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
